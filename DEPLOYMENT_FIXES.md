# Vercel Deployment Troubleshooting & Fix Guide

## Critical Issues Found

### 1. **CORS Configuration (Most Common Issue)**
Your backend on Render needs to accept requests from your Vercel domain. The frontend is making API calls that are being blocked.

**Solution:**
Update your FastAPI backend to include CORS headers:

```python
from fastapi.middleware.cors import CORSMiddleware

# In your main FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://YOUR-VERCEL-DOMAIN.vercel.app",  # Replace with your Vercel URL
        "http://localhost:3000",  # For local testing
        "http://localhost:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. **Vercel Routing Configuration**
✅ **Fixed:** Updated `vercel.json` to properly handle all routes

### 3. **Environment Configuration**

**For Your Deployed Site:**
1. Find your Vercel deployment URL (e.g., `https://bloom-abc123.vercel.app`)
2. Update the `backendApi` in `js/config.env.js` if needed:
   ```javascript
   backendApi: "https://bloom-w0r1.onrender.com"  // This is correct
   ```

### 4. **Module Loading Issues**
✅ **Verified:** Both `register.html` and `dashboard.html` correctly use `type="module"`

---

## Checklist for Deployment

### Step 1: Verify Backend CORS
```bash
# Test if your backend accepts requests from Vercel
curl -H "Origin: https://your-vercel-app.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: content-type" \
     -X OPTIONS \
     https://bloom-w0r1.onrender.com/api/endpoint
```

You should see `Access-Control-Allow-Origin` header in response.

### Step 2: Check Browser Console
1. Deploy to Vercel
2. Open DevTools (F12)
3. Go to Console tab
4. Check for:
   - **CORS errors** → Need to fix backend CORS
   - **Module loading errors** → Check file paths
   - **API 404 errors** → Backend endpoints might not exist

### Step 3: Verify File Paths
All relative paths in your HTML/CSS/JS are correct:
- ✅ `<link rel="stylesheet" href="css/styles.css">` 
- ✅ `<script src="js/script.js"></script>`
- ✅ `import CONFIG from './config.env.js'`

### Step 4: Render Backend Status
1. Visit: https://bloom-w0r1.onrender.com (should not show Vercel error page)
2. If it shows "Application failed to boot", check Render logs
3. If backend is sleeping, it takes ~30 seconds to wake up

---

## Common Issues & Fixes

### Issue: Pages render but UI is broken
**Likely Cause:** CSS files not loading  
**Fix:**
- Check Network tab in DevTools
- CSS files should return 200 status
- If 404, verify file paths in HTML

### Issue: "Cannot read properties of undefined" errors
**Likely Cause:** Module imports failing  
**Fix:**
- Ensure `type="module"` is on script tags
- Check that `config.env.js` exports correctly:
  ```javascript
  export default CONFIG;
  ```

### Issue: API calls fail with "CORS error"
**Likely Cause:** Backend doesn't allow requests  
**Fix:**
- Add Vercel domain to backend CORS allowed origins
- Deploy backend changes
- Wait 30-60 seconds for Render to restart

### Issue: "Cannot GET /register" or "Cannot GET /dashboard"
**Likely Cause:** Server routes not configured  
**Fix:** ✅ Already fixed in `vercel.json`

---

## Debugging Steps

### 1. Open DevTools Network Tab
- Deploy to Vercel
- Open website
- Navigate to register/dashboard
- Check Network tab for failed requests
- Look for red items (errors)

### 2. Check Backend Endpoint URLs
In `js/dashboard.js` and `js/register.js`, find where API calls are made:
```javascript
const BACKEND_API = CONFIG.backendApi; // Should be: https://bloom-w0r1.onrender.com
```

### 3. Test API Directly
Try accessing your backend API directly in browser:
```
https://bloom-w0r1.onrender.com/api/farmers
```

If this shows CORS error, the backend CORS is the issue.

### 4. Check Render Logs
1. Go to https://dashboard.render.com
2. Select your service
3. Click "Logs" tab
4. Look for error messages

---

## Working Solution Sequence

1. **Backend Ready?**
   - [ ] FastAPI running on Render
   - [ ] CORS configured for your Vercel domain
   - [ ] All endpoints accessible

2. **Frontend Ready?**
   - [ ] All files uploaded to Vercel
   - [ ] `vercel.json` configured correctly ✅
   - [ ] `config.env.js` has correct backend URL ✅

3. **Firebase Firestore?**
   - [ ] Firestore rules allow unauthenticated read/write
   - [ ] Firebase config is correct (your API key is public, that's normal)

4. **Environment Variables (if needed)**
   - If you need to hide API keys, create `.env.local`:
     ```
     VITE_BACKEND_API=https://bloom-w0r1.onrender.com
     VITE_GEMINI_KEY=your_key
     ```
   - Then update config to read from environment

---

## Critical Backend Fix Example

If you're using FastAPI, your `main.py` should have:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()

# CORS Configuration - CRITICAL!
origins = [
    "https://bloom-abc123.vercel.app",  # Your actual Vercel URL
    "https://bloom-website.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Or use ["*"] for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Your routes here
@app.get("/api/farmers")
async def get_farmers():
    return {"farmers": []}
```

---

## Files Modified for Deployment
- ✅ `vercel.json` - Updated routing rules
- ✅ `js/config.env.prod.js` - Created production config helper
- ⚠️ Backend CORS - **YOU MUST FIX THIS**

---

## Next Steps
1. **Share your Vercel URL** when deployed
2. **Check Network tab** in browser DevTools
3. **Report exact error messages** you see
4. **Verify backend CORS** is configured
5. **Check Render logs** for backend errors

