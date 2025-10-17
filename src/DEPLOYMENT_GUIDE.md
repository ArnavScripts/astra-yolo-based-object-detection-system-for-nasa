# YOLO Model Deployment Guide

## Overview
This guide explains how to connect your trained YOLO model (trained on 1769 images) to this Space Station Safety Detection application.

## Step 1: Deploy Your Trained Model

You have several options to deploy your YOLO model:

### Option A: Roboflow (Recommended for Beginners)

1. **Upload Your Model to Roboflow:**
   - Go to https://roboflow.com
   - Create an account and a new project
   - Upload your trained model weights
   - Publish your model to get an API endpoint

2. **Get Your API Endpoint:**
   - Format: `https://detect.roboflow.com/YOUR-MODEL-ID/YOUR-VERSION`
   - Get your API key from Roboflow dashboard

3. **Configure in the App:**
   - Go to the "Setup" tab
   - Select "Roboflow" as Model Type
   - Enter your endpoint URL
   - Enter your Roboflow API key
   - Click "Save Configuration"

### Option B: Hugging Face

1. **Deploy to Hugging Face Inference API:**
   - Create a Hugging Face account
   - Upload your model to Hugging Face Hub
   - Get the inference endpoint URL

2. **Configure in the App:**
   - Model Type: "Hugging Face"
   - Endpoint: `https://api-inference.huggingface.co/models/YOUR-USERNAME/YOUR-MODEL`
   - API Key: Your Hugging Face access token

### Option C: Custom Server (Advanced)

If you want to host the model yourself:

1. **Create a Flask/FastAPI Server:**

```python
from flask import Flask, request, jsonify
from ultralytics import YOLO
import base64
import cv2
import numpy as np

app = Flask(__name__)
model = YOLO('path/to/your/best.pt')  # Your trained model

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    image_data = data['image']
    
    # Decode base64 image
    if 'base64,' in image_data:
        image_data = image_data.split('base64,')[1]
    
    img_bytes = base64.b64decode(image_data)
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Run inference
    results = model(img)
    
    # Format detections
    detections = []
    for r in results:
        boxes = r.boxes
        for box in boxes:
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            detections.append({
                'className': model.names[int(box.cls[0])],
                'confidence': float(box.conf[0]),
                'bbox': {
                    'x': x1 / img.shape[1],  # Normalize to 0-1
                    'y': y1 / img.shape[0],
                    'width': (x2 - x1) / img.shape[1],
                    'height': (y2 - y1) / img.shape[0]
                }
            })
    
    return jsonify({'detections': detections})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

2. **Deploy the Server:**
   - Use services like Railway, Render, or AWS
   - Get your deployment URL

3. **Configure in the App:**
   - Model Type: "Custom Endpoint"
   - Endpoint: Your server URL + `/predict`
   - API Key: Optional (if you add authentication)

## Step 2: Expected API Response Format

Your API endpoint should return detections in one of these formats:

### Format 1 (Recommended):
```json
{
  "detections": [
    {
      "className": "FireExtinguisher",
      "confidence": 0.95,
      "bbox": {
        "x": 0.1,
        "y": 0.2,
        "width": 0.15,
        "height": 0.2
      }
    }
  ]
}
```

### Format 2 (Roboflow):
```json
{
  "predictions": [
    {
      "class": "OxygenTank",
      "confidence": 0.98,
      "box": {
        "x": 100,
        "y": 150,
        "width": 80,
        "height": 120
      }
    }
  ]
}
```

The application automatically normalizes different formats.

## Step 3: Test Your Integration

1. Navigate to the "Setup" tab
2. Configure your model endpoint
3. Go to the "Detection" tab
4. Upload a test image from your validation set
5. Verify detections appear correctly

## Troubleshooting

### Issue: "Model endpoint not configured"
- Go to Setup tab and configure your model endpoint

### Issue: Detection fails
- Check that your API endpoint is accessible
- Verify the API key is correct
- Check browser console for detailed error messages
- Ensure your model endpoint accepts base64 encoded images

### Issue: Wrong detections
- Verify you're using the correct trained model weights
- Check that the class names in your model match the expected ones:
  - OxygenTank
  - NitrogenTank
  - FirstAidBox
  - FireAlarm
  - SafetySwitchPanel
  - EmergencyPhone
  - FireExtinguisher

### Issue: Bounding boxes in wrong position
- Ensure bbox coordinates are normalized (0-1 range)
- Check that x, y represent top-left corner
- Verify width and height are relative to image dimensions

## Training Dataset Information

Your model was trained on **1769 images** covering 7 safety object classes. This training data is already used in your model weights file (best.pt or similar). You don't need to upload the training images to this application - they were used during the training phase to create the model.

This application is for **inference only** - it sends new test images to your deployed model and displays the detection results.

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your API endpoint with a tool like Postman
3. Ensure your model is properly deployed and accessible
4. Check that image data is being sent in the correct format

## Security Note

Never commit your API keys to version control. The app stores them securely in the database.
