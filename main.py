from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import joblib  # or import pickle
import pandas as pd

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained ML model from .pkl
model = joblib.load("model.pkl")  # Update path if needed

# Input model
class PredictRequest(BaseModel):
    date: str
    category: str
    region: str
    inventoryLevel: float
    unitsSold: float
    price: float
    discount: float
    weatherCondition: str
    isHoliday: bool
    seasonality: str

@app.post("/predict")
def predict(req: PredictRequest):
    # Prepare input data for model
    input_df = pd.DataFrame([{
        "date": req.date,
        "category": req.category,
        "region": req.region,
        "inventoryLevel": req.inventoryLevel,
        "unitsSold": req.unitsSold,
        "price": req.price,
        "discount": req.discount,
        "weatherCondition": req.weatherCondition,
        "isHoliday": int(req.isHoliday),
        "seasonality": req.seasonality
    }])

    # Note: Make sure input_df is preprocessed (encoding, scaling, etc.) as expected by your model

    # Predict
    predicted_demand = model.predict(input_df)[0]
    confidence = 92.5  # You can generate this from model if available

    # Dummy data for charts
    historical = [{"month": i, "demand": int(predicted_demand - 20 + i * 5)} for i in range(1, 4)]
    forecast = [{"month": i, "demand": int(predicted_demand + i * 3)} for i in range(4, 7)]

    return {
        "predictedDemand": int(predicted_demand),
        "confidence": confidence,
        "historicalData": historical,
        "forecastData": forecast
    }
