# ASTRA Model Setup Guide

This guide will help you connect your YOLOv8 model to the ASTRA detection system.

## 🚀 Quick Start

ASTRA supports three types of model endpoints:

1. **Roboflow** - Easy hosted solution
2. **Hugging Face** - Free inference API
3. **Custom** - Your own deployed model

---

## 1️⃣ Roboflow Setup

### Step 1: Train Your Model
1. Go to [Roboflow](https://roboflow.com)
2. Create a project and upload your training images
3. Annotate your images with the 7 safety classes:
   - OxygenTank
   - NitrogenTank
   - FirstAidBox
   - FireAlarm
   - SafetySwitchPanel
   - EmergencyPhone
   - FireExtinguisher
4. Train your model using YOLOv8

### Step 2: Get Your API Endpoint
1. After training, go to your model's **Deploy** tab
2. Select **Hosted API**
3. Copy your inference URL (looks like: `https://detect.roboflow.com/your-project/1`)
4. Copy your API key

### Step 3: Configure in ASTRA
1. Go to the **Setup** tab in ASTRA
2. Select **Roboflow** as model type
3. Paste your endpoint URL
4. Paste your API key
5. Click **Save Configuration**
6. Test the connection

**Example Configuration:**
```
Model Type: Roboflow
Endpoint: https://detect.roboflow.com/space-safety/1
API Key: your_roboflow_api_key_here
```

---

## 2️⃣ Hugging Face Setup

### Step 1: Choose or Upload a Model
1. Go to [Hugging Face Models](https://huggingface.co/models?pipeline_tag=object-detection)
2. Find a YOLOv8 object detection model or upload your own
3. Note the model ID (e.g., `facebook/detr-resnet-50`)

### Step 2: Get Your API Token
1. Go to [Hugging Face Settings](https://huggingface.co/settings/tokens)
2. Create a new access token (Read access is sufficient)
3. Copy the token

### Step 3: Configure in ASTRA
1. Go to the **Setup** tab in ASTRA
2. Select **Hugging Face** as model type
3. Enter endpoint: `https://api-inference.huggingface.co/models/YOUR_MODEL_ID`
4. Paste your API token
5. Click **Save Configuration**
6. Test the connection

**Example Configuration:**
```
Model Type: Hugging Face
Endpoint: https://api-inference.huggingface.co/models/keremberke/yolov8n-hard-hat-detection
API Key: hf_your_token_here
```

**Note:** Hugging Face Inference API is free but may have rate limits. For production use, consider Hugging Face Pro or deploy your own endpoint.

---

## 3️⃣ Custom Endpoint Setup

### Step 1: Deploy Your YOLOv8 Model

You can deploy using various platforms:

#### Option A: FastAPI (Recommended)
```python
from fastapi import FastAPI, File, UploadFile
from ultralytics import YOLO
import base64
from io import BytesIO
from PIL import Image

app = FastAPI()
model = YOLO('your_model.pt')

@app.post("/detect")
async def detect(image: str):
    # Decode base64 image
    image_data = base64.b64decode(image.split(',')[1] if ',' in image else image)
    img = Image.open(BytesIO(image_data))
    
    # Run inference
    results = model(img)
    
    # Format detections
    detections = []
    for result in results:
        for box in result.boxes:
            detections.append({
                'className': model.names[int(box.cls)],
                'confidence': float(box.conf),
                'bbox': {
                    'x': float(box.xyxy[0][0]),
                    'y': float(box.xyxy[0][1]),
                    'width': float(box.xyxy[0][2] - box.xyxy[0][0]),
                    'height': float(box.xyxy[0][3] - box.xyxy[0][1])
                }
            })
    
    return {'success': True, 'detections': detections}
```

Deploy to:
- **Railway**: `railway up`
- **Render**: Deploy from GitHub
- **Google Cloud Run**: `gcloud run deploy`
- **AWS Lambda**: Use serverless framework

#### Option B: Flask
```python
from flask import Flask, request, jsonify
from ultralytics import YOLO
import base64
from io import BytesIO
from PIL import Image

app = Flask(__name__)
model = YOLO('your_model.pt')

@app.route('/detect', methods=['POST'])
def detect():
    data = request.json
    image_data = data.get('image') or data.get('imageData')
    
    # Process similar to FastAPI example
    # ... (same logic)
    
    return jsonify({'success': True, 'detections': detections})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

### Step 2: Configure in ASTRA
1. Go to the **Setup** tab in ASTRA
2. Select **Custom Endpoint** as model type
3. Enter your deployed endpoint URL
4. (Optional) Add your API key if you implemented authentication
5. Click **Save Configuration**
6. Test the connection

**Example Configuration:**
```
Model Type: Custom Endpoint
Endpoint: https://your-app.railway.app/detect
API Key: your_custom_api_key (optional)
```

---

## 🔍 Testing Your Configuration

After configuring your model:

1. Click **Test Connection** button
2. ASTRA will send a test image to your endpoint
3. If successful, you'll see a ✓ success message
4. If failed, check:
   - Is your endpoint URL correct?
   - Is your API key valid?
   - Is your model server running?
   - Check browser console for detailed errors

---

## 📝 API Request Format

ASTRA sends requests in this format:

### Roboflow
```
POST https://detect.roboflow.com/project/version?api_key=YOUR_KEY
Content-Type: application/x-www-form-urlencoded

base64_image_data_without_prefix
```

### Hugging Face
```
POST https://api-inference.huggingface.co/models/model-id
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "inputs": "data:image/jpeg;base64,..."
}
```

### Custom
```
POST https://your-endpoint.com/detect
Authorization: Bearer YOUR_KEY (optional)
X-API-Key: YOUR_KEY (optional)
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,...",
  "imageData": "data:image/jpeg;base64,...",
  "inputs": "data:image/jpeg;base64,..."
}
```

---

## 📊 Expected Response Format

Your endpoint should return detections in one of these formats:

### Standard Format (Recommended)
```json
{
  "success": true,
  "detections": [
    {
      "className": "FireExtinguisher",
      "confidence": 0.95,
      "bbox": {
        "x": 100,
        "y": 150,
        "width": 50,
        "height": 80
      }
    }
  ]
}
```

### Roboflow Format
```json
{
  "predictions": [
    {
      "class": "FireExtinguisher",
      "confidence": 0.95,
      "x": 125,
      "y": 190,
      "width": 50,
      "height": 80
    }
  ]
}
```

### Hugging Face Format
```json
[
  {
    "label": "FireExtinguisher",
    "score": 0.95,
    "box": {
      "xmin": 100,
      "ymin": 150,
      "xmax": 150,
      "ymax": 230
    }
  }
]
```

ASTRA automatically normalizes all these formats!

---

## 🛠️ Troubleshooting

### "Model endpoint not configured"
- Go to Setup tab and configure your model endpoint
- Make sure to save the configuration

### "Connection failed: 401 Unauthorized"
- Check your API key is correct
- Make sure API key has proper permissions

### "Connection failed: 404 Not Found"
- Verify your endpoint URL is correct
- Make sure your model server is running
- Check the URL doesn't have typos

### "Detection failed: timeout"
- Your model server might be slow or cold-starting
- Hugging Face Inference API can take 10-20s on first request
- Try again after model warms up

### No detections returned
- Check if your model is trained on the correct classes
- Verify the image contains objects from your training set
- Lower the confidence threshold in Advanced settings

### Camera not working
- Grant camera permissions in browser settings
- HTTPS is required for camera access
- Try using Chrome or Safari for best compatibility

---

## 💡 Tips for Best Results

1. **Image Quality**: Upload clear, well-lit images
2. **Object Visibility**: Ensure safety equipment is clearly visible
3. **Confidence Threshold**: Start with 0.25 and adjust in Advanced tab
4. **Model Training**: Train with at least 100+ images per class
5. **Testing**: Use the Test Connection feature before full deployment

---

## 🔐 Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for API keys in custom deployments
3. **Implement rate limiting** on custom endpoints
4. **Use HTTPS** for all endpoints
5. **Rotate API keys** regularly

---

## 📚 Additional Resources

- [YOLOv8 Documentation](https://docs.ultralytics.com)
- [Roboflow Docs](https://docs.roboflow.com)
- [Hugging Face Inference API](https://huggingface.co/docs/api-inference)
- [FastAPI Documentation](https://fastapi.tiangolo.com)

---

## 🆘 Need Help?

If you encounter issues:
1. Check browser console for error messages
2. Verify your model endpoint is accessible
3. Test your endpoint with Postman/cURL first
4. Ensure your model returns the expected format
5. Check ASTRA logs in browser DevTools

Happy detecting! 🚀
