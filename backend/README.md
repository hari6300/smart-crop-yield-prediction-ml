# Crop Yield ML Backend

## 1. Create environment

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## 2. Train the model

```bash
python train_model.py
```

The training script downloads the India crop-yield dataset from Hugging Face and trains a Random Forest regression model. Production is excluded from model inputs to avoid target leakage.

## 3. Start the API

```bash
python app.py
```

API: http://localhost:5000

Health check: http://localhost:5000/health

Prediction: POST http://localhost:5000/predict
