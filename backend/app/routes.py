from fastapi import APIRouter, HTTPException, status
from typing import List
from .models import SensorData
from .database import sensor_collection
from datetime import datetime

router = APIRouter()

@router.post("/sensor-data", status_code=status.HTTP_201_CREATED)
async def create_sensor_data(data: SensorData):
    try:
        data_dict = data.model_dump()
        
        result = await sensor_collection.insert_one(data_dict)
        return {"message": "Data saved successfully", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.get("/latest-data", response_model=SensorData)
async def get_latest_data():
    latest_record = await sensor_collection.find_one({}, sort=[("timestamp", -1)])
    if not latest_record:
        raise HTTPException(status_code=404, detail="No sensor data found")
    
    return SensorData(**latest_record)

@router.get("/history", response_model=List[SensorData])
async def get_history():
    cursor = sensor_collection.find({}).sort("timestamp", -1).limit(50)
    history = await cursor.to_list(length=50)
    
    if not history:
        return []
        
    result = []
    for record in history:
        result.append(SensorData(**record))
        
    return result
