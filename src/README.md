# Space Station Safety Object Detection

An advanced AI-powered web application for detecting critical safety equipment in space station environments using YOLOv8 object detection.

## Features

- **Real-Time Object Detection**: Upload images and get instant detection results from your trained YOLO model
- **Camera Integration**: Capture images directly from your device camera
- **🤖 AI Chatbot Assistant**: Get instant help with setup, troubleshooting, and features
- **🌍 Multilingual Support**: Full interface in English and Hindi (more languages coming soon!)
- **Batch Processing**: Process multiple images at once
- **Comparison Mode**: Compare detection results across different images
- **Live Statistics**: Track detection counts and performance metrics
- **Export Results**: Download detection results in JSON or CSV format
- **Confidence Threshold Control**: Adjust detection sensitivity

## Detectable Safety Objects

The system is trained to detect 7 critical safety items:

1. 🔥 **Fire Extinguisher**
2. 💨 **Oxygen Tank**
3. 🫧 **Nitrogen Tank**
4. 🩹 **First Aid Box**
5. 🚨 **Fire Alarm**
6. 🔌 **Safety Switch Panel**
7. 📞 **Emergency Phone**

## Getting Started

### Step 1: Configure Your Model

1. Navigate to the **Setup** tab
2. Deploy your trained YOLO model using one of these platforms:
   - **Roboflow** (Recommended for beginners)
   - **Hugging Face**
   - **Custom Server** (Advanced)
3. Enter your model endpoint URL and API key
4. Click "Save Configuration"

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### Step 2: Start Detecting

1. Go to the **Detection** tab
2. Upload an image or use the camera capture feature
3. View detection results with bounding boxes and confidence scores
4. Export results as needed

## Training Data

This application connects to a YOLO model trained on **1769 images** from the Falcon Digital Twin space station simulation platform. The training data covers various lighting conditions, angles, and object placements to ensure robust detection.

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Motion (Framer Motion)
- **Backend**: Supabase Edge Functions
- **AI Model**: YOLOv8 (Ultralytics)
- **Detection API**: RESTful API integration

## How It Works

1. **Image Upload**: User uploads an image or captures from camera
2. **API Call**: Image is sent to your configured YOLO model endpoint
3. **Inference**: Your trained model processes the image and detects objects
4. **Results Display**: Detections are displayed with bounding boxes and confidence scores
5. **Visualization**: Interactive canvas renders the results with color-coded boxes

## API Integration

The application supports multiple YOLO deployment platforms through a standardized API interface. Your model endpoint should accept base64-encoded images and return detection results in JSON format.

Example API request:
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

Example API response:
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

## Advanced Features

- **Confidence Threshold**: Adjust the minimum confidence level for detections
- **Batch Processing**: Process multiple images simultaneously
- **Comparison Mode**: Compare detections across two images side-by-side
- **Performance Monitoring**: Track inference time and system performance
- **Export Options**: Download results in multiple formats

## Project Context

This application was developed for space station safety monitoring, utilizing the Falcon Digital Twin platform to create realistic training scenarios. The YOLO model is specifically trained to identify critical safety equipment that could be life-saving in emergency situations aboard a space station.

## Troubleshooting

### Model Endpoint Not Configured
If you see "Model endpoint not configured":
- This is **normal** on first use - you need to configure your model
- Go to the **Setup** tab and enter your model endpoint and API key
- See [MODEL_NOT_CONFIGURED_INFO.md](./MODEL_NOT_CONFIGURED_INFO.md) for detailed setup instructions
- This is a **one-time setup** that takes 2 minutes

### Camera Permission Issues
If you see "NotAllowedError: Permission denied":
- This is **normal** when first using the camera feature
- Click "Allow" when your browser asks for camera permission
- See [CAMERA_PERMISSIONS_INFO.md](./CAMERA_PERMISSIONS_INFO.md) for detailed guidance
- Or check [CAMERA_TROUBLESHOOTING.md](./CAMERA_TROUBLESHOOTING.md) for browser-specific fixes
- **Alternative**: Use the "Upload Image" feature instead

### No detections appearing
- Verify your model endpoint is configured correctly in the Setup tab
- Check that your API key is valid
- Ensure the image contains one or more of the 7 trained object classes

### Incorrect detections
- This happens when the model endpoint is not properly configured
- Make sure you're using your actual trained model, not mock data
- Verify the model was trained on the correct classes

### API errors
- Check browser console for detailed error messages
- Verify your model endpoint is accessible
- Ensure your API key has proper permissions

For more help, see:
- [MODEL_SETUP_GUIDE.md](./MODEL_SETUP_GUIDE.md) - Model configuration
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Deployment instructions
- [CAMERA_PERMISSIONS_INFO.md](./CAMERA_PERMISSIONS_INFO.md) - Camera permissions explained

## New Features 🎉

### AI Chatbot Assistant 🤖
Get instant help with:
- Model setup and configuration
- Camera troubleshooting
- Understanding detection results
- Feature explanations
- Common error solutions

**How to use**: Click the floating chat button in the bottom-right corner!

### Multilingual Support 🌍
ASTRA now speaks your language!
- **English** 🇬🇧 - Full support
- **Hindi** 🇮🇳 - पूर्ण समर्थन
- More languages coming soon!

**How to use**: Click the language switcher in the header to change languages instantly!

See [AI_CHATBOT_MULTILINGUAL_GUIDE.md](./AI_CHATBOT_MULTILINGUAL_GUIDE.md) for detailed information.

## License

This project is created for educational and research purposes.

## Credits

- **YOLO**: Ultralytics YOLOv8
- **Simulation Platform**: Falcon Digital Twin
- **UI Framework**: React + shadcn/ui
- **Backend**: Supabase
- **AI Assistant**: Custom knowledge-based chatbot
- **i18n**: Multi-language support system
