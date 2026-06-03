# Network & Timeout Errors - Troubleshooting Guide

## Current Issue

You're getting a **timeout error** on the forgot-password request:
```
timeout of 10000ms exceeded
```

This means the request took longer than 10 seconds to respond.

---

## Possible Causes

### 1. Backend Server is Offline ❌
- The Render.com backend may be sleeping (free tier goes to sleep)
- Server may have crashed
- Database connection issues

### 2. Backend is Slow 🐌
- High server load
- Slow database queries
- Network latency

### 3. Incorrect Endpoint URL 🔗
- The endpoint path might be wrong
- Backend doesn't have this endpoint
- Typo in the URL

### 4. Network/Firewall Issues 🛡️
- ISP blocking the request
- Corporate firewall
- VPN issues

### 5. CORS Not Configured 🚫
- Backend not allowing requests from your frontend
- CORS headers missing

---

## Quick Diagnosis

Open browser console and run:

```javascript
// Test if backend is reachable
fetch('https://myjobs-backend-b2y5.onrender.com/health/')
  .then(r => console.log('✅ Backend OK:', r.status))
  .catch(e => console.error('❌ Backend Error:', e.message))

// Test forgot-password endpoint
fetch('https://myjobs-backend-b2y5.onrender.com/accounts/forgot-password/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com' })
})
  .then(r => r.json().then(d => console.log('Response:', r.status, d)))
  .catch(e => console.error('Error:', e.message))
```

---

## Using Network Diagnostics

I've created a network diagnostics tool. Use it in browser console:

```javascript
// Import the diagnostics tool
import { networkDiagnostics } from '@/service/networkDiagnostics.js'

// Test backend connectivity
networkDiagnostics.testBackendConnectivity()

// Test specific endpoint
networkDiagnostics.testEndpoint('/accounts/forgot-password/', 'POST', {
  email: 'test@example.com'
})

// Run full diagnostics
networkDiagnostics.runFullDiagnostics()
```

---

## Step-by-Step Troubleshooting

### Step 1: Check Backend Status

Go to: https://myjobs-backend-b2y5.onrender.com/

If you see an error or blank page, the backend is down.

**Solution**: 
- Check Render.com dashboard
- Check backend logs
- Restart the backend

### Step 2: Test with Longer Timeout

I've increased the default timeout to **15 seconds**. Try again:

```
1. Close the app completely
2. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. Try forgot-password again
4. Check console for updated error
```

### Step 3: Check CORS Configuration

If you see CORS errors, the backend needs to allow your frontend domain.

**Backend should have:**
```python
# Django example
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://yourdomain.com",
]

# OR allow all (not recommended for production)
CORS_ALLOW_ALL_ORIGINS = True
```

### Step 4: Verify Endpoint URL

Check if the endpoint exists in your backend:

```bash
# Test from command line
curl -X POST https://myjobs-backend-b2y5.onrender.com/accounts/forgot-password/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

---

## Backend Render.com Setup

If your backend is on Render.com **free tier**:

⚠️ **Free tier goes to sleep after 15 minutes of inactivity**

**Solution:**
- Upgrade to paid tier, OR
- Use a "keep-alive" service to ping the backend every 10 minutes

**Keep-alive setup:**
```javascript
// Add to your frontend (e.g., in App.jsx)
useEffect(() => {
  const interval = setInterval(async () => {
    try {
      await fetch('https://myjobs-backend-b2y5.onrender.com/health/');
      console.log('✅ Backend keep-alive ping sent');
    } catch (e) {
      console.warn('⚠️ Keep-alive ping failed');
    }
  }, 10 * 60 * 1000); // Every 10 minutes
  
  return () => clearInterval(interval);
}, []);
```

---

## Files Updated

| File | Change |
|------|--------|
| **src/service/api.js** | Increased timeout, better error messages |
| **src/service/networkDiagnostics.js** | ✨ NEW - Network testing utility |

---

## What to Check

**Checklist:**
- [ ] Backend server is running
- [ ] Backend URL is correct (`https://myjobs-backend-b2y5.onrender.com`)
- [ ] CORS is configured
- [ ] Endpoint exists (`/accounts/forgot-password/`)
- [ ] Network/ISP not blocking
- [ ] VPN not causing issues
- [ ] Firewall allowing outbound requests

---

## If Backend is Down

### Quick Fix: Restart Backend

If using Render.com:
1. Go to dashboard
2. Find your backend service
3. Click "Manual Deploy" or restart

### Temporary Fix: Skip Backend

For local testing without backend:
```javascript
// Mock the API in api.js during development
if (process.env.NODE_ENV === 'development') {
  // Mock responses for testing
}
```

---

## Check Backend Logs

### Render.com Logs:
1. Dashboard → Your Service
2. Logs tab
3. Look for errors

### Express/Node.js:
```javascript
// Should log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

### Django:
```python
# Check Django logs
python manage.py runserver --verbosity 2
```

---

## Common Error Messages

| Error | Meaning | Fix |
|-------|---------|-----|
| `timeout of Xms exceeded` | Request too slow | Increase timeout or fix backend |
| `Failed to fetch` | Network error | Check internet, backend URL |
| `CORS error` | Backend doesn't allow your domain | Add CORS configuration |
| `404 Not Found` | Endpoint doesn't exist | Check endpoint path |
| `503 Service Unavailable` | Backend is down | Restart backend |

---

## Next Steps

1. **Run diagnostics**:
   ```javascript
   import { networkDiagnostics } from '@/service/networkDiagnostics.js'
   networkDiagnostics.runFullDiagnostics()
   ```

2. **Check backend status** at: https://myjobs-backend-b2y5.onrender.com/

3. **Verify endpoint** with curl (see above)

4. **Check Render.com dashboard** for backend logs

5. **Report the specific error** from diagnostics

---

## If Still Not Working

Provide the output from:
```javascript
networkDiagnostics.runFullDiagnostics()
```

This will help diagnose the exact issue!
