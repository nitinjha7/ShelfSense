from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import joblib  # or import pickle
import pandas as pd
from sklearn.preprocessing import StandardScaler

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained ML model from .pkl
model_bundle = joblib.load("shelfSense.pkl")
model = model_bundle["model"]
scaler = model_bundle["scaler"]

# Input model
class PredictRequest(BaseModel):
    category: int
    region: int
    inventoryLevel: int
    unitsSold: int
    price: int
    discount: int
    weatherCondition: int
    isHoliday: bool
    seasonality: int

@app.post("/predict")
def predict(req: PredictRequest):
    try:
        # Prepare input data for model
        input_df = pd.DataFrame([{
            "category": req.category,
            "region": req.region,
            "inventoryLevel": req.inventoryLevel,
            "unitsSold": req.unitsSold,
            "price": req.price,
            "discount": req.discount,
            "weatherCondition": req.weatherCondition,
            "isHoliday": 1 if req.isHoliday else 0,
            "seasonality": req.seasonality
        }])

        # Note: Make sure input_df is preprocessed (encoding, scaling, etc.) as expected by your model
        # scaler = StandardScaler()
        input_df = scaler.transform(input_df)

        # Predict
        predicted_demand = model.predict(input_df)[0]

        return {
            "predictedDemandForecast": int(predicted_demand)
        }

    except Exception as e:
        # Optional: log the error
        print(f"Prediction error: {e}")
        return {
            "error": "An error occurred during prediction. Please check your input data and try again."
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
