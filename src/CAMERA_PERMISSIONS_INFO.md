# 📷 Camera Permissions - What to Expect

## This is Normal Behavior ✅

When you first use the camera feature in ASTRA, you'll see a browser permission prompt. This is **completely normal and expected**.

---

## What Happens Step-by-Step

### 1️⃣ First Time Using Camera

When you click **"Start Camera"**:
- Your browser will show a permission prompt
- This prompt asks: "Allow this site to use your camera?"
- You have two options:
  - ✅ **Allow** - Camera will work
  - ❌ **Block/Deny** - You'll see an error message

### 2️⃣ If You Click "Allow"
- Camera activates immediately
- You'll see a live preview
- A "LIVE" indicator shows camera is active
- You can capture photos for detection
- Browser remembers your choice (won't ask again)

### 3️⃣ If You Click "Block" or "Deny"
- You'll see: **"Error accessing camera: NotAllowedError: Permission denied"**
- This error is **expected** - it means you denied permission
- Don't panic! This is not a bug
- ASTRA will show you helpful instructions to enable permissions
- You can click "Retry" after enabling permissions

---

## Understanding the Error Message

```
Error accessing camera: NotAllowedError: Permission denied
```

**What it means:**
- ✅ Your browser is working correctly
- ✅ ASTRA is working correctly
- ℹ️ You (or your browser) blocked camera access
- 🔧 You need to allow camera permissions to use this feature

**This is NOT:**
- ❌ A bug in the application
- ❌ A security issue
- ❌ Something broken

---

## How to Allow Camera Access

### Quick Fix (Most Common)

1. **Look for the camera icon** 📷 in your browser's address bar
2. **Click it**
3. **Select "Allow"**
4. **Click "Retry"** in ASTRA
5. **Done!** Camera should work now

### Detailed Instructions by Browser

#### Chrome / Edge
1. Click the camera icon 📷 or lock icon 🔒 in the address bar
2. Find "Camera" in the permissions list
3. Select "Allow"
4. Refresh the page if needed

#### Firefox
1. Click the camera icon 📷 in the address bar
2. Click the "X" next to "Blocked Temporarily"
3. Allow when prompted
4. Or: Click "Allow" in the permission dropdown

#### Safari
1. Safari menu → Settings for This Website
2. Camera → Allow
3. Refresh the page

---

## Why Does This Happen?

### Browser Security (Good Thing!)

Browsers require **explicit user permission** to access:
- Camera
- Microphone
- Location
- Other sensitive features

This protects your privacy by ensuring websites can't secretly activate your camera.

### HTTPS Requirement

Camera access requires:
- ✅ HTTPS (secure connection) - has 🔒 in address bar
- ✅ OR localhost (for development)
- ❌ HTTP (non-secure) won't work

---

## FAQ

### Q: Will ASTRA remember my choice?
**A:** Yes! Once you click "Allow", your browser remembers and won't ask again on this site.

### Q: Can I use ASTRA without allowing camera?
**A:** Absolutely! Just use the "Upload Image" feature instead. It works exactly the same.

### Q: Is my camera stream sent to a server?
**A:** No! Camera access is only used to capture a still image locally. The captured image is then sent for detection, but the live stream stays on your device.

### Q: What if I accidentally clicked "Block"?
**A:** No problem! Follow the instructions above to change the permission from "Block" to "Allow".

### Q: The instructions didn't work. Now what?
**A:** Check the detailed `CAMERA_TROUBLESHOOTING.md` guide for advanced solutions, or use the "Upload Image" option instead.

### Q: Why doesn't the error go away in the console?
**A:** Some browsers log the permission denial before we can catch it. This is normal. The important thing is that ASTRA handles it gracefully and shows you helpful instructions.

---

## Alternative: Use Upload Instead

If camera permissions are problematic:

1. Take a photo with your phone/camera
2. Use the **"Upload Image"** feature
3. Select your photo
4. Detection works exactly the same!

No camera permissions needed! 📸

---

## Privacy & Security

### What ASTRA Does
- ✅ Only accesses camera when you click "Start Camera"
- ✅ Shows a clear "LIVE" indicator when active
- ✅ Stops camera immediately after capture
- ✅ Processes images locally when possible
- ✅ Never secretly activates your camera

### What You Control
- ✅ When to grant permission
- ✅ When to activate camera
- ✅ When to capture images
- ✅ Can revoke permission anytime in browser settings

### Browser Protections
- ✅ Explicit permission required
- ✅ Usually shows indicator when camera is active (🔴 or camera icon)
- ✅ You can revoke access anytime
- ✅ Permissions are per-site

---

## Summary

**The "Permission denied" error is completely normal the first time you use the camera feature.**

It simply means:
1. Your browser is protecting your privacy (good!)
2. You need to click "Allow" when prompted
3. Then the camera will work perfectly

**Not a bug, not an issue - just browser security doing its job!** 🛡️

---

## Still Having Issues?

1. ✅ **First**: Check the camera icon in your address bar
2. ✅ **Second**: Follow browser-specific instructions above
3. ✅ **Third**: Check `CAMERA_TROUBLESHOOTING.md` for advanced help
4. ✅ **Last Resort**: Use "Upload Image" instead

Happy detecting! 🚀
