# ℹ️ Model Endpoint Not Configured

## This is Expected Behavior on First Use ✅

When you first open ASTRA, you'll see a message about the model endpoint not being configured. **This is completely normal!**

---

## What It Means

The message "Model endpoint not configured" simply means:
- ✅ You haven't set up your YOLO model connection yet
- ✅ ASTRA needs to know where your trained model is hosted
- ✅ This is a **one-time setup step**

**This is NOT:**
- ❌ An error or bug
- ❌ Something broken
- ❌ A problem with the application

---

## Quick Fix (2 minutes)

### Step 1: Go to Setup Tab
Click the **"Setup"** tab at the top of the application, or click the **"Configure Model Now"** button in the blue notice.

### Step 2: Choose Your Model Platform
Select one of these options:

#### Option A: Roboflow (Easiest)
1. Select "Roboflow" as model type
2. Enter your Roboflow endpoint URL
   - Format: `https://detect.roboflow.com/your-project/version`
3. Enter your API key
4. Click "Save Configuration"

#### Option B: Hugging Face
1. Select "Hugging Face" as model type
2. Enter your model URL
   - Format: `https://api-inference.huggingface.co/models/your-model`
3. Enter your Hugging Face API token
4. Click "Save Configuration"

#### Option C: Custom Endpoint
1. Select "Custom" as model type
2. Enter your custom model endpoint URL
3. Enter your API key (if required)
4. Click "Save Configuration"

### Step 3: Test Connection
1. Click the **"Test Connection"** button
2. Wait for confirmation message
3. Done! ✅

### Step 4: Start Detecting
1. Go back to the **"Detection"** tab
2. Upload an image or use the camera
3. See your detections! 🎉

---

## Why This Happens

### Security & Privacy
ASTRA doesn't come with a pre-configured model endpoint because:
- 🔒 Your API keys should be private
- 🔒 Your model endpoint is unique to you
- 🔒 We don't want to hardcode credentials

### Flexibility
Different users have different setups:
- Some use Roboflow
- Some use Hugging Face
- Some have custom deployments
- Some have different model versions

ASTRA supports all of these! You just need to configure it once.

---

## First-Time Setup Checklist

Before you can detect objects, you need:

- [ ] **Step 1**: Train or obtain a YOLO model
  - Or use an existing deployed model
  
- [ ] **Step 2**: Deploy your model to:
  - Roboflow Inference API
  - Hugging Face Inference API
  - Your own custom server
  - Or another YOLO-compatible endpoint

- [ ] **Step 3**: Get your credentials:
  - Model endpoint URL
  - API key (if required)

- [ ] **Step 4**: Configure ASTRA (see "Quick Fix" above)

- [ ] **Step 5**: Test connection

- [ ] **Step 6**: Start detecting!

---

## After Initial Setup

Once you've configured your model:
- ✅ ASTRA remembers your configuration
- ✅ You won't see the "not configured" message again
- ✅ Detection features work immediately
- ✅ No need to reconfigure (unless you change models)

---

## Common Questions

### Q: I don't have a model yet. What do I do?
**A:** You need to either:
1. Train your own YOLO model on your dataset
2. Use a pre-trained model (if available)
3. See [MODEL_SETUP_GUIDE.md](./MODEL_SETUP_GUIDE.md) for deployment options

### Q: Can I use ASTRA without configuring a model?
**A:** No, ASTRA requires a model endpoint to perform detections. However, the setup only takes 2 minutes!

### Q: Will I see this error every time I open ASTRA?
**A:** No! Only until you configure your model. After that, ASTRA remembers your settings.

### Q: Can I change my model later?
**A:** Yes! Go to the Setup tab anytime to update your configuration.

### Q: What if I don't have an API key?
**A:** 
- Roboflow: Sign up for a free account
- Hugging Face: Create a free account and generate a token
- Custom: Depends on your deployment (you may not need one)

### Q: Is my API key stored securely?
**A:** Yes! Your configuration is stored securely in Supabase Key-Value storage and is only accessible through your authenticated session.

---

## Error Messages Explained

### "Model endpoint not configured. Please configure your model in the Setup tab."
- **What it means**: You haven't set up your model yet
- **How to fix**: Go to Setup tab and configure (see "Quick Fix" above)
- **Expected?**: Yes, on first use

### "Detection error: Model endpoint not configured"
- **What it means**: Same as above
- **How to fix**: Configure your model in Setup tab
- **Expected?**: Yes, until you configure

---

## Summary

**The "Model endpoint not configured" message is NOT an error!**

It's simply ASTRA's way of saying:
> "Hey! I'm ready to detect objects, but I need to know where your model is hosted first. Please take 2 minutes to configure it in the Setup tab."

Think of it like a new car - it works perfectly, but you need to set up your radio presets and seat position first!

---

## Need Help?

### Model Deployment
→ [MODEL_SETUP_GUIDE.md](./MODEL_SETUP_GUIDE.md)

### Roboflow Setup
→ [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Roboflow section

### Hugging Face Setup
→ [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Hugging Face section

### Custom Deployment
→ [MODEL_SETUP_GUIDE.md](./MODEL_SETUP_GUIDE.md) - Custom section

### General Questions
→ [README.md](./README.md)

---

**Happy detecting! 🚀 Remember: This is a one-time setup, and it only takes 2 minutes!**
