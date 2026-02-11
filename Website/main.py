from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import tensorflow as tf
from PIL import Image
import numpy as np
import json
import os
import random
import requests
import io

MODEL_PATH = 'model.h5'
MODEL_URL = 'https://huggingface.co/BeluBeluga/Bloom/resolve/main/cropmodel.h5'
DATASET_PATH = 'dataset'
REGIONAL_DATA_PATH = 'regionaldata.json'

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if os.path.exists(DATASET_PATH):
    app.mount("/images", StaticFiles(directory=DATASET_PATH), name="images")

model = None
class_names = None
all_images = []

def download_model():
    if not os.path.exists(MODEL_PATH):
        print(f"Downloading model from Hugging Face")
        response = requests.get(MODEL_URL, stream=True)
        response.raise_for_status()
        with open(MODEL_PATH, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print("Model downloaded")

def load_model():
    global model, class_names, all_images
    if model is None:
        download_model()
        model = tf.keras.models.load_model(MODEL_PATH)
        
        # Get class names from dataset structure
        class_names = sorted([d for d in os.listdir(DATASET_PATH) 
                            if os.path.isdir(os.path.join(DATASET_PATH, d))])
        
        # Collect all image paths for live feed simulation
        for class_name in class_names:
            class_dir = os.path.join(DATASET_PATH, class_name)
            for file in os.listdir(class_dir):
                if file.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp')):
                    all_images.append({
                        'path': os.path.join(class_dir, file),
                        'url': f"/images/{class_name}/{file}",
                        'actual_class': class_name
                    })
        
        print(f"Model loaded with {len(class_names)} classes")
        print(f"Found {len(all_images)} images for live feed")

@app.on_event("startup")
async def startup():
    load_model()

@app.get("/")
async def root():
    return {"status": "Satellite Crop Analytics Dashboard API"}

@app.get("/dashboard-stats")
async def dashboard_stats():
    if not os.path.exists(REGIONAL_DATA_PATH):
        return JSONResponse(
            status_code=404,
            content={"error": "Regional data not found. Run setup.py first"}
        )
    
    with open(REGIONAL_DATA_PATH, 'r') as f:
        data = json.load(f)
    
    return data

@app.get("/simulate-live-feed")
async def simulate_live_feed():
    if not all_images:
        return JSONResponse(
            status_code=404,
            content={"error": "No images found in dataset"}
        )
    
    # Randomly select an image
    selected = random.choice(all_images)
    
    # Load and preprocess image
    img = Image.open(selected['path']).convert('RGB')
    img_resized = img.resize((64, 64))
    img_array = np.array(img_resized) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    
    # Run prediction
    predictions = model.predict(img_array, verbose=0)
    predicted_idx = np.argmax(predictions[0])
    confidence = float(predictions[0][predicted_idx])
    predicted_class = class_names[predicted_idx]
    
    # Get all class probabilities
    probabilities = {class_names[i]: float(predictions[0][i]) 
                    for i in range(len(class_names))}
    
    return {
        'image_url': selected['url'],
        'actual_class': selected['actual_class'],
        'predicted_class': predicted_class,
        'confidence': round(confidence * 100, 2),
        'all_probabilities': probabilities,
        'analysis_timestamp': 'live'
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert('RGB')
    img = img.resize((64, 64))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    
    predictions = model.predict(img_array, verbose=0)
    predicted_idx = np.argmax(predictions[0])
    confidence = float(predictions[0][predicted_idx])
    predicted_class = class_names[predicted_idx]
    
    probabilities = {class_names[i]: float(predictions[0][i]) 
                    for i in range(len(class_names))}
    
    return {
        'predicted_class': predicted_class,
        'confidence': round(confidence * 100, 2),
        'all_probabilities': probabilities
    }
