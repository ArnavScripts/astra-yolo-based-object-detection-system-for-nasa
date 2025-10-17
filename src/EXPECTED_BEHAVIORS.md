# ✅ Expected Behaviors in ASTRA

This document explains behaviors that are **normal and expected**, not bugs or errors.

---

## 1. Model Endpoint Not Configured ✅

### What You'll See
```
Error: Model endpoint not configured. Please configure your model in the Setup tab.
```

### Why This Happens
- You haven't configured your YOLO model endpoint yet
- This is **required** before you can detect objects
- This is a **one-time setup** that takes 2 minutes

### Is This Normal?
**YES!** This is expected behavior on first use.

### How to Fix
1. Click **"Setup"** tab
2. Enter your model endpoint and API key
3. Click **"Save Configuration"**
4. Done! You won't see this again

### More Information
→ [MODEL_NOT_CONFIGURED_INFO.md](./MODEL_NOT_CONFIGURED_INFO.md)

---

## 2. Camera Permission Denied ✅

### What You'll See
```
Error accessing camera: NotAllowedError: Permission denied
```

### Why This Happens
- Your browser is protecting your privacy (good!)
- You need to click "Allow" when prompted for camera access
- Or you previously blocked camera access

### Is This Normal?
**YES!** This is expected browser security behavior.

### How to Fix
1. Look for camera icon 📷 in browser address bar
2. Click it and select "Allow"
3. Click "Retry" in ASTRA
4. Or just use "Upload Image" instead

### More Information
→ [CAMERA_PERMISSIONS_INFO.md](./CAMERA_PERMISSIONS_INFO.md)
→ [CAMERA_TROUBLESHOOTING.md](./CAMERA_TROUBLESHOOTING.md)

---

## 3. No Objects Detected (But Image Processed) ✅

### What You'll See
```
ℹ️ No objects detected in this image.
```

### Why This Happens
- Image doesn't contain any of the 7 trained safety objects
- Objects are too small or obscured
- Confidence threshold is set too high
- Lighting/angle makes detection difficult

### Is This Normal?
**YES!** Not every image will contain detectable objects.

### What to Try
1. Lower confidence threshold in "Advanced" tab
2. Try a different image with clearer objects
3. Ensure image contains one of the 7 safety objects:
   - Fire Extinguisher
   - Oxygen Tank
   - Nitrogen Tank
   - First Aid Box
   - Fire Alarm
   - Safety Switch Panel
   - Emergency Phone

---

## 4. First Load Shows "Welcome to ASTRA" Notice ✅

### What You'll See
A blue notice with setup instructions and "Configure Model Now" button

### Why This Happens
- Model isn't configured yet
- ASTRA is guiding you through first-time setup

### Is This Normal?
**YES!** This helps new users get started.

### How to Proceed
Click **"Configure Model Now"** and follow the setup wizard

---

## 5. Browser Asks for HTTPS ✅

### What You'll See
```
Camera requires HTTPS. Please use a secure connection.
```

### Why This Happens
- Camera access requires secure connection (HTTPS)
- Or localhost for development

### Is This Normal?
**YES!** This is a browser security requirement.

### How to Fix
- Use HTTPS connection
- Or use localhost for development
- Cannot use HTTP for camera access

---

## 6. Initial Model Test May Be Slow ✅

### What You'll See
- "Testing connection..." takes 10-30 seconds
- First detection may be slower

### Why This Happens
- Cold start for serverless functions
- Model initialization on first request
- Network latency to model endpoint

### Is This Normal?
**YES!** Subsequent requests will be faster.

### What to Expect
- First request: 10-30 seconds
- Subsequent requests: 1-5 seconds

---

## 7. Console Warnings About localStorage ✅

### What You'll See (in browser console)
```
Warning: localStorage is not available in private browsing mode
```

### Why This Happens
- Browser private/incognito mode
- Browser settings block local storage

### Is This Normal?
**YES!** ASTRA will still work, just won't save history locally.

### Impact
- Detection history won't persist between sessions
- Settings won't be saved
- Otherwise fully functional

---

## 8. Initial Page Load Shows Empty Stats ✅

### What You'll See
- Detection Count: 0
- Total Objects: 0
- History: Empty

### Why This Happens
- You haven't run any detections yet
- No history to display

### Is This Normal?
**YES!** Stats populate as you use the app.

---

## Summary: What's Normal vs What's Not

### ✅ **Normal** (Expected Behavior)

| Message/Behavior | Reason | Action |
|------------------|--------|--------|
| "Model endpoint not configured" | First-time use | Configure in Setup tab |
| "Permission denied" (camera) | Browser security | Click "Allow" in browser |
| "No objects detected" | No safety objects in image | Try different image |
| Setup notice on Detection tab | Model not configured | Click "Configure Model" |
| Slow first detection | Cold start | Wait, subsequent faster |
| Empty stats initially | No detections yet | Normal, will populate |
| "Camera requires HTTPS" | Security requirement | Use HTTPS or localhost |

### ❌ **Not Normal** (Actual Issues)

| Message/Behavior | Reason | Action |
|------------------|--------|--------|
| "Network error" | Connection issue | Check internet connection |
| "API returned 500" | Model endpoint issue | Check model deployment |
| "Invalid API key" | Wrong credentials | Verify API key in Setup |
| Blank white screen | JavaScript error | Check browser console |
| Images won't upload | File size/format | Use JPG/PNG under 10MB |
| Detections show wrong classes | Wrong model | Verify correct model endpoint |

---

## Quick Diagnostic

### If you see "Model endpoint not configured":
✅ **Expected** → Configure model in Setup tab

### If you see "Permission denied" (camera):
✅ **Expected** → Allow camera in browser settings

### If you see "No objects detected":
✅ **Expected** → Image may not contain trained objects

### If you see "Network error":
❌ **Issue** → Check internet connection

### If you see "Invalid API key":
❌ **Issue** → Verify API key is correct

### If you see "API returned 500":
❌ **Issue** → Model endpoint may be down

---

## Getting Help

### For Expected Behaviors
- These are normal! See documentation linked above
- No need to report as bugs
- Usually resolved with simple configuration

### For Actual Issues
1. Check browser console for errors
2. Verify model endpoint is accessible
3. Test API key is valid
4. Check [README.md](./README.md) troubleshooting section
5. See [MODEL_SETUP_GUIDE.md](./MODEL_SETUP_GUIDE.md) for deployment help

---

## Documentation Index

| Topic | Document |
|-------|----------|
| Model not configured | [MODEL_NOT_CONFIGURED_INFO.md](./MODEL_NOT_CONFIGURED_INFO.md) |
| Camera permissions | [CAMERA_PERMISSIONS_INFO.md](./CAMERA_PERMISSIONS_INFO.md) |
| Camera troubleshooting | [CAMERA_TROUBLESHOOTING.md](./CAMERA_TROUBLESHOOTING.md) |
| Model setup | [MODEL_SETUP_GUIDE.md](./MODEL_SETUP_GUIDE.md) |
| Deployment guide | [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) |
| Quick start | [QUICK_START.md](./QUICK_START.md) |
| Main README | [README.md](./README.md) |

---

**Remember: "Model endpoint not configured" and "Permission denied" are the two most common expected behaviors for new users. They're not bugs - just setup steps!** ✅
