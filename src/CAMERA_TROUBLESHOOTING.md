# 📷 Camera Troubleshooting Guide

This guide will help you resolve camera access issues in ASTRA.

---

## 🔴 Error: "Permission denied" or "NotAllowedError"

This means your browser has blocked camera access for this site.

### ✅ Quick Fix

1. **Look for the camera icon** 📷 in your browser's address bar
2. **Click it** and select "Allow"
3. **Refresh the page** and try again

---

## 🌐 Browser-Specific Instructions

### Google Chrome / Microsoft Edge

#### Method 1: Address Bar (Fastest)
1. Click the **camera icon** 📷 in the address bar (right side)
2. Select **"Always allow"** for camera
3. Click **"Done"**
4. Refresh the page

#### Method 2: Site Settings
1. Click the **lock icon** 🔒 in the address bar
2. Click **"Site settings"**
3. Find **"Camera"** in the permissions list
4. Change to **"Allow"**
5. Refresh the page

#### Method 3: Chrome Settings (Full Reset)
1. Go to `chrome://settings/content/camera`
2. Find this site in the **"Blocked"** list
3. Click the **trash icon** to remove it
4. Refresh the page and allow when prompted

---

### Mozilla Firefox

#### Method 1: Address Bar
1. Click the **camera icon** 📷 in the address bar
2. Click the **X** next to "Blocked Temporarily"
3. Click **"Allow"** when prompted again
4. Refresh the page

#### Method 2: Page Info
1. Click the **lock icon** 🔒 in the address bar
2. Click **"Connection secure"** → **"More information"**
3. Go to the **"Permissions"** tab
4. Find **"Use the Camera"**
5. Uncheck **"Use Default"** and select **"Allow"**
6. Close and refresh

#### Method 3: Firefox Settings
1. Go to `about:preferences#privacy`
2. Scroll to **"Permissions"** → **"Camera"**
3. Click **"Settings..."**
4. Remove this site from blocked list
5. Refresh and allow when prompted

---

### Safari (macOS)

#### Method 1: Website Settings
1. Click **Safari** in the menu bar
2. Select **"Settings for This Website"**
3. Find **"Camera"** and set to **"Allow"**
4. Refresh the page

#### Method 2: Safari Preferences
1. Click **Safari** → **"Preferences"**
2. Go to **"Websites"** tab
3. Select **"Camera"** from the left sidebar
4. Find this website and set to **"Allow"**
5. Refresh the page

#### Method 3: System Preferences
1. Open **System Settings** (or System Preferences)
2. Go to **"Privacy & Security"** → **"Camera"**
3. Make sure **Safari** is checked/enabled
4. Restart Safari and try again

---

### Safari (iOS/iPadOS)

1. Open **Settings** app
2. Scroll to **Safari**
3. Tap **"Camera"**
4. Select **"Allow"**
5. Return to Safari and refresh the page

---

## 🔒 HTTPS Requirement

**Important:** Camera access requires a secure connection (HTTPS) in most browsers.

### ✅ Check if you're on HTTPS
- Your URL should start with `https://` (not `http://`)
- Look for a lock icon 🔒 in the address bar

### ❌ If you're on HTTP
- Camera will **not work** (except on `localhost`)
- Deploy your app with HTTPS enabled
- Or use `localhost` for testing

---

## 🖥️ System-Level Camera Permissions

Sometimes the issue is at the operating system level:

### Windows 10/11

1. Press **Windows + I** to open Settings
2. Go to **Privacy & security** → **Camera**
3. Make sure **"Camera access"** is **ON**
4. Ensure **"Let apps access your camera"** is **ON**
5. Scroll down and enable for your browser (Chrome, Firefox, Edge)
6. Restart your browser

### macOS

1. Open **System Settings** (or System Preferences)
2. Go to **Privacy & Security** → **Camera**
3. Make sure your browser is **checked** in the list
4. If not listed, restart your browser and try accessing camera again
5. Grant permission when prompted

### Linux

1. Check if your camera is working:
   ```bash
   ls /dev/video*
   ```
2. If nothing appears, your camera isn't detected
3. Check camera permissions:
   ```bash
   sudo chmod 666 /dev/video0
   ```
4. Restart your browser

---

## 🔍 Common Issues & Solutions

### "Camera is already in use by another application"

**Cause:** Another program is using your camera

**Solution:**
- Close video conferencing apps (Zoom, Teams, Skype)
- Close other browser tabs using the camera
- Restart your browser
- Restart your computer if needed

### "No camera found on this device"

**Cause:** No camera detected

**Solution:**
- Check if your camera is properly connected
- Try a different USB port (for external cameras)
- Update camera drivers
- Test camera in another app (e.g., Photo Booth, Camera app)

### "Camera not supported in this browser"

**Cause:** Old browser version or unsupported browser

**Solution:**
- Update to the latest browser version
- Use a modern browser: Chrome, Firefox, Safari, or Edge
- Avoid Internet Explorer (not supported)

### "Camera works but shows black screen"

**Cause:** Camera permission granted but hardware issue

**Solution:**
- Check if camera lens is covered
- Try unplugging and reconnecting (external cameras)
- Update camera drivers
- Restart your device

### "Permission prompt never appears"

**Cause:** Browser has cached a "deny" decision

**Solution:**
- Clear browser cache and cookies
- Reset site permissions (see browser instructions above)
- Try in incognito/private browsing mode
- Restart browser

---

## 🧪 Testing Your Camera

Before using ASTRA, test if your camera works:

### Quick Camera Test Websites
- Chrome: `chrome://settings/content/camera` → "Check camera"
- Firefox: Visit any WebRTC test site
- Online: [webcamtests.com](https://webcamtests.com)

### Browser Console Check
1. Press **F12** to open Developer Tools
2. Go to **Console** tab
3. Paste this code:
   ```javascript
   navigator.mediaDevices.getUserMedia({ video: true })
     .then(() => console.log('✅ Camera works!'))
     .catch(err => console.error('❌ Camera error:', err.message));
   ```
4. Press Enter
5. If you see "✅ Camera works!" - camera is functioning
6. If you see an error - follow the error message guidance

---

## 🆘 Still Not Working?

If you've tried everything above:

### Alternative Solution: Use Upload Instead
1. Go to the **Detection** tab
2. Use the **"Upload Image"** feature instead of camera
3. Take a photo with your phone/camera app
4. Upload the image file

### Report the Issue
If camera should be working but isn't:
1. Note your browser version
2. Note your operating system
3. Copy any error messages from browser console (F12)
4. Report the issue with these details

---

## ✅ Prevention Tips

To avoid camera issues in the future:

1. **Always allow camera access** when prompted
2. **Use HTTPS** for all deployments
3. **Keep browser updated** to latest version
4. **Test camera** before important sessions
5. **Close other camera apps** when using ASTRA
6. **Grant system permissions** for your browser

---

## 📱 Mobile Devices

### Android (Chrome)

1. Tap the **address bar**
2. Tap the **lock/info icon**
3. Tap **"Permissions"**
4. Set **"Camera"** to **"Allow"**
5. Refresh the page

If that doesn't work:
1. Open Chrome **Settings**
2. Tap **"Site settings"** → **"Camera"**
3. Find this site and set to **"Allow"**

### iOS/iPadOS (Safari)

1. Open iOS **Settings**
2. Scroll to **Safari**
3. Tap **"Camera"**
4. Select **"Allow"**
5. Return to Safari and refresh

---

## 🎯 Summary Checklist

- [ ] Browser permissions granted (check address bar icon)
- [ ] System permissions granted (OS Settings)
- [ ] Using HTTPS (not HTTP)
- [ ] No other apps using camera
- [ ] Browser is up to date
- [ ] Camera hardware is working
- [ ] Site not in blocked list
- [ ] Tried refreshing the page
- [ ] Tried clearing cache/cookies
- [ ] Tested in incognito/private mode

If all items are checked and camera still doesn't work, use the **Upload Image** feature as an alternative!

---

**Need more help?** Check the browser console (F12) for detailed error messages.
