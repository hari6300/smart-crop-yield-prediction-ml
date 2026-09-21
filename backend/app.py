from pathlib import Path
import json
import uuid
from datetime import datetime, timezone

import joblib
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

BASE = Path(__file__).resolve().parent
MODEL_PATH = BASE / "model" / "crop_yield_random_forest.joblib"
METRICS_PATH = BASE / "model" / "metrics.json"

app = Flask(__name__)
CORS(app)

if not MODEL_PATH.exists():
    raise RuntimeError("ML model not found. Run: python train_model.py")

model = joblib.load(MODEL_PATH)
metrics = json.loads(METRICS_PATH.read_text()) if METRICS_PATH.exists() else {}


def feature_rows(data):
    area_acres = float(data["area"])
    area_ha = area_acres * 0.40468564224
    fertilizer_per_ha = float(data["fertilizer"])
    pesticide_per_ha = float(data.get("pesticide", 2.0))
    row = {
        "Year": int(data.get("year", datetime.now().year)),
        "State": str(data["state"]),
        "Crop": str(data["crop"]),
        "Season": str(data["season"]),
        "Area_ha": area_ha,
        "Annual_Rainfall": float(data["rainfall"]),
        "Fertilizer_per_ha": fertilizer_per_ha,
        "Pesticide_per_ha": pesticide_per_ha,
    }
    return pd.DataFrame([row]), row


@app.get("/health")
def health():
    return jsonify({"status": "ok", "model": metrics.get("model", "Random Forest Regressor"), "metrics": metrics})


@app.post("/predict")
def predict():
    data = request.get_json(silent=True) or {}
    required = ["crop", "state", "area", "rainfall", "fertilizer", "season"]
    missing = [x for x in required if x not in data or data[x] in (None, "")]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    try:
        frame, row = feature_rows(data)
        prediction = float(model.predict(frame)[0])
        prediction = max(0.0, round(prediction, 2))

        # Tree-to-tree spread is presented as a model prediction spread, not a statistical 95% CI.
        rf = model.named_steps["model"]
        transformed = model.named_steps["preprocessor"].transform(frame)
        tree_predictions = [float(tree.predict(transformed)[0]) for tree in rf.estimators_]
        spread_low = max(0.0, round(float(pd.Series(tree_predictions).quantile(0.025)), 2))
        spread_high = round(float(pd.Series(tree_predictions).quantile(0.975)), 2)

        area_ha = row["Area_ha"]
        total_production = round(prediction * area_ha, 2)
        yield_per_acre = round(prediction * 0.40468564224, 2)

        r2 = float(metrics.get("r2", 0))
        category = "Low" if prediction < 1 else "Moderate" if prediction < 2 else "Good" if prediction < 4 else "High"

        # Global model feature importance, returned as transparent model explanation.
        names = list(model.named_steps["preprocessor"].get_feature_names_out())
        importances = rf.feature_importances_
        grouped = {}
        for name, value in zip(names, importances):
            base = name.split("__", 1)[-1]
            base = base.split("_")[0] if base.split("_")[0] in {"State", "Crop", "Season"} else base
            grouped[base] = grouped.get(base, 0) + float(value)
        top = sorted(grouped.items(), key=lambda x: x[1], reverse=True)[:5]
        impacts = [
            {
                "name": name,
                "score": round(value * 100, 1),
                "status": "positive",
                "description": "Global feature importance in the trained Random Forest; this is not a causal effect."
            }
            for name, value in top
        ]

        recommendations = [
            "Use the prediction as a planning estimate and compare it with local agricultural guidance.",
            "Weather values should represent the crop-growing season rather than a single day's weather when possible.",
            "For fertilizer decisions, use a soil-test-based recommendation instead of relying only on the model estimate."
        ]

        return jsonify({
            "id": str(uuid.uuid4()),
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "predictedYield": prediction,
            "yieldPerAcre": yield_per_acre,
            "areaHectares": round(area_ha, 2),
            "totalProduction": total_production,
            "modelR2": round(r2 * 100, 2),
            "predictionSpread": {"min": spread_low, "max": spread_high},
            "yieldCategory": category,
            "featureImpacts": impacts,
            "recommendations": recommendations,
            "model": metrics.get("model", "Random Forest Regressor"),
            "input": data,
        })
    except (TypeError, ValueError, KeyError) as exc:
        return jsonify({"error": f"Invalid prediction input: {exc}"}), 400


import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)