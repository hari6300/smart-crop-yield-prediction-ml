<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/c8e7cfc6-6e17-4030-92ae-f9315ad83f4a

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Real ML backend

The frontend now calls a Python Random Forest API instead of the old rule-based prediction function.

### Start ML backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python train_model.py
python app.py
```

Then, in another terminal:

```bash
npm install
npm run dev
```

The ML API runs on `http://localhost:5000`. The frontend uses `VITE_ML_API_URL` when provided.

The training script uses the India crop-yield dataset from Hugging Face and intentionally excludes `Production` from the features to avoid target leakage.
