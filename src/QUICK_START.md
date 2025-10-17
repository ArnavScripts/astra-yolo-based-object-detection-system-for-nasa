# 🚀 ASTRA Quick Start Guide

Get started with ASTRA in 3 simple steps!

---

## Step 1️⃣: Configure Your Model (2 minutes)

1. Click the **"Setup"** tab
2. Choose your model type:
   - **Roboflow**: Easiest option for beginners
   - **Hugging Face**: Free inference API
   - **Custom**: Your own deployed model
3. Enter your endpoint URL and API key
4. Click **"Save Configuration"**
5. Click **"Test Connection"** to verify

**Need help?** See [MODEL_SETUP_GUIDE.md](./MODEL_SETUP_GUIDE.md)

---

## Step 2️⃣: Upload or Capture Image (1 minute)

1. Go to the **"Detection"** tab

### Option A: Upload Image
- Drag & drop an image onto the upload area
- Or click "Browse Files" to select an image

### Option B: Camera Capture
- Click **"Start Camera"**
- **IMPORTANT**: Click **"Allow"** when browser asks for camera permission
- Position safety equipment in frame
- Click **"Capture Photo"**

**Camera not working?** See [CAMERA_PERMISSIONS_INFO.md](./CAMERA_PERMISSIONS_INFO.md)

---

## Step 3️⃣: View Results (instant!)

- Detection results appear automatically
- See bounding boxes around detected objects
- View confidence scores for each detection
- Export results as JSON or CSV

---

## ⚡ That's It!

You're now detecting safety objects with AI! 🎉

---

## Common First-Time Issues

### "Camera Permission Denied" Error

**This is completely normal!** 

✅ **Quick Fix:**
1. Look for camera icon 📷 in address bar
2. Click it and select "Allow"
3. Click "Retry" in ASTRA
4. Done!

**Or just use "Upload Image" instead - works the same!**

### "Model endpoint not configured"

✅ **Quick Fix:**
1. Go to "Setup" tab
2. Configure your model endpoint
3. Save and return to "Detection" tab

### No Objects Detected

✅ **Quick Fix:**
- Make sure image contains safety equipment
- Lower confidence threshold in "Advanced" tab
- Check if model is trained on these objects

---

## 🎯 Detection Features

### 7 Detectable Objects
- 🔥 Fire Extinguisher
- 💨 Oxygen Tank
- 🫧 Nitrogen Tank
- 🩹 First Aid Box
- 🚨 Fire Alarm
- 🔌 Safety Switch Panel
- 📞 Emergency Phone

### Advanced Features
- **Batch Processing**: Upload multiple images
- **Comparison Mode**: Compare two images side-by-side
- **Analytics**: View detection history and statistics
- **Export**: Download results in multiple formats
- **Real-time Stats**: Track performance metrics

---

## 📚 More Resources

| Document | What's In It |
|----------|-------------|
| [README.md](./README.md) | Complete overview |
| [MODEL_SETUP_GUIDE.md](./MODEL_SETUP_GUIDE.md) | Model deployment guide |
| [CAMERA_PERMISSIONS_INFO.md](./CAMERA_PERMISSIONS_INFO.md) | Camera permissions explained |
| [CAMERA_TROUBLESHOOTING.md](./CAMERA_TROUBLESHOOTING.md) | Fix camera issues |
| [FEATURES.md](./FEATURES.md) | All features explained |

---

## 💡 Pro Tips

1. **Good Lighting**: Ensure images are well-lit for best results
2. **Clear View**: Objects should be clearly visible
3. **Adjust Threshold**: Try different confidence levels (0.1 - 0.9)
4. **Save Results**: Export detections for later analysis
5. **Batch Process**: Process multiple images to save time

---

## ❓ Need Help?

### Camera Issues
→ [CAMERA_PERMISSIONS_INFO.md](./CAMERA_PERMISSIONS_INFO.md)

### Model Setup Issues
→ [MODEL_SETUP_GUIDE.md](./MODEL_SETUP_GUIDE.md)

### General Questions
→ [README.md](./README.md)

---

## 🎉 You're Ready!

Start detecting safety objects and keep your space station secure! 🚀

**Remember**: Camera permission errors are normal the first time - just click "Allow"!
