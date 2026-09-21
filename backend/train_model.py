from pathlib import Path
import json
import joblib
import pandas as pd
from datasets import load_dataset
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

BASE = Path(__file__).resolve().parent
MODEL_DIR = BASE / "model"
MODEL_DIR.mkdir(exist_ok=True)

FEATURES = [
    "Year", "State", "Crop", "Season", "Area_ha",
    "Annual_Rainfall", "Fertilizer_per_ha", "Pesticide_per_ha"
]
TARGET = "Yield"
CATEGORICAL = ["State", "Crop", "Season"]
NUMERICAL = ["Year", "Area_ha", "Annual_Rainfall", "Fertilizer_per_ha", "Pesticide_per_ha"]


def prepare(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df = df.dropna(subset=["Year", "State", "Crop", "Season", "Area", "Annual_Rainfall", "Fertilizer", "Pesticide", "Yield"])
    df = df[df["Area"] > 0]
    df["Area_ha"] = pd.to_numeric(df["Area"], errors="coerce")
    df["Fertilizer_per_ha"] = pd.to_numeric(df["Fertilizer"], errors="coerce") / df["Area_ha"]
    df["Pesticide_per_ha"] = pd.to_numeric(df["Pesticide"], errors="coerce") / df["Area_ha"]
    df["Year"] = pd.to_numeric(df["Year"], errors="coerce")
    df["Annual_Rainfall"] = pd.to_numeric(df["Annual_Rainfall"], errors="coerce")
    df["Yield"] = pd.to_numeric(df["Yield"], errors="coerce")
    df = df.replace([float("inf"), float("-inf")], pd.NA).dropna(subset=FEATURES + [TARGET])
    # Avoid nonsensical extreme ratios from corrupt/zero-like records.
    df = df[(df["Yield"] >= 0) & (df["Yield"] < 100)]
    return df


def main():
    print("Downloading India crop-yield dataset from Hugging Face...")
    train = load_dataset("dhyann2815/india-crop-yield-prediction", split="train").to_pandas()
    test = load_dataset("dhyann2815/india-crop-yield-prediction", split="test").to_pandas()
    train = prepare(train)
    test = prepare(test)

    X_train, y_train = train[FEATURES], train[TARGET]
    X_test, y_test = test[FEATURES], test[TARGET]

    preprocessor = ColumnTransformer([
        ("cat", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL),
    ], remainder="passthrough")

    model = RandomForestRegressor(
        n_estimators=300,
        random_state=42,
        n_jobs=-1,
        max_features="sqrt",
        min_samples_leaf=2,
    )

    pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("model", model),
    ])

    print(f"Training on {len(train):,} rows; testing on {len(test):,} rows...")
    pipeline.fit(X_train, y_train)
    pred = pipeline.predict(X_test)

    mae = mean_absolute_error(y_test, pred)
    rmse = mean_squared_error(y_test, pred) ** 0.5
    r2 = r2_score(y_test, pred)

    metrics = {
        "model": "Random Forest Regressor",
        "train_rows": int(len(train)),
        "test_rows": int(len(test)),
        "mae": round(float(mae), 4),
        "rmse": round(float(rmse), 4),
        "r2": round(float(r2), 4),
        "features": FEATURES,
        "note": "Production is intentionally excluded to prevent target leakage because yield is derived from production and area."
    }

    joblib.dump(pipeline, MODEL_DIR / "crop_yield_random_forest.joblib")
    (MODEL_DIR / "metrics.json").write_text(json.dumps(metrics, indent=2))
    print(json.dumps(metrics, indent=2))
    print(f"Saved: {MODEL_DIR / 'crop_yield_random_forest.joblib'}")


if __name__ == "__main__":
    main()
