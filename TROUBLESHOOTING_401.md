# 401 Unauthorized Error - Troubleshooting Guide

## What Does 401 Mean?

**401 Unauthorized** means the server rejected your request because:
- No authentication token was provided
- The token is invalid or expired
- The token format is incorrect
- Your account lacks required permissions

## Why Are You Getting 401?

Your app is getting 401 errors on:
1. **Dashboard Analytics** (`/analytics/summary/`) - This requires authentication
2. **Forgot Password** (`/accounts/forgot-password/`) - This should be public (now fixed ✅)

---

## Quick Fixes

### Fix 1: Ensure You're Logged In ✅ (Most Common)

1. Go to the **Login** page
2. Enter your credentials and log in
3. Check if the token was saved:
   ```javascript
   // In browser console:
   localStorage.getItem('access')
   // Should show a long token string, not null
   ```

### Fix 2: Check Token Format

Your token should start with `eyJ`. If it looks different, there may be a backend issue.

```javascript
// In browser console:
localStorage.getItem('access')?.substring(0, 20) + '...'
```

### Fix 3: Clear Bad Tokens and Re-login

```javascript
// In browser console:
localStorage.clear()
// Then log in again
```

---

## Debugging Steps

### Step 1: Check Authentication Status

Open browser console and run:

```javascript
// Check if user is logged in
localStorage.getItem('access') ? '✅ Logged in' : '❌ Not logged in'

// Check both tokens
console.log({
  access: localStorage.getItem('access')?.substring(0, 30) + '...',
  refresh: localStorage.getItem('refresh')?.substring(0, 30) + '...'
})
```

### Step 2: Decode Your Token

```javascript
// Paste this in browser console to decode and inspect your token
function decodeToken() {
  const token = localStorage.getItem('access');
  if (!token) return console.error('No token found');
  
  try {
    const parts = token.split('.');
    const decoded = JSON.parse(atob(parts[1]));
    console.log('Token decoded:', decoded);
    console.log('Expires at:', new Date(decoded.exp * 1000));
    return decoded;
  } catch (e) {
    console.error('Failed to decode:', e);
  }
}

decodeToken()
```

### Step 3: Verify API Endpoint Format

Your backend should accept tokens in this format:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

The updated API should now send it correctly (see [src/service/api.js](src/service/api.js)).

### Step 4: Check Network Tab

1. Open DevTools → Network tab
2. Try logging in or accessing dashboard
3. Look for failed requests
4. Click on the failed request
5. Check:
   - **Status**: Should be 200/201 (not 401)
   - **Request Headers**: Should have `Authorization: Bearer ...`
   - **Response**: Should show error message from backend

---

## Common Scenarios

### Scenario 1: Works Locally, Fails in Production

**Possible causes:**
- Production backend URL is different
- Backend not configured to accept requests from your domain
- Environment variables not set in production
- CORS issues

**Fix:**
- Verify `baseURL` in [src/service/api.js](src/service/api.js)
- Set environment variables on your hosting platform
- Check backend CORS configuration

### Scenario 2: Works After Login, Then 401 After Refresh

**Possible cause:** Token stored in `localStorage` survives page refresh, but may be expired

**Fix:**
```javascript
// Check if token is expired
const token = localStorage.getItem('access');
const parts = token.split('.');
const decoded = JSON.parse(atob(parts[1]));
const expiryTime = decoded.exp * 1000;
const isExpired = Date.now() > expiryTime;
console.log('Token expired?', isExpired);
```

### Scenario 3: "Failed to load resource" for Forgot Password

**This should be fixed now!** ✅

The forgot password endpoint is now in the `PUBLIC_ENDPOINTS` list, so it won't try to attach a token.

---

## File Changes Made

| File | Change |
|------|--------|
| [src/service/api.js](src/service/api.js) | Added public endpoints list, improved 401 handling |
| [src/auth/authState.js](src/auth/authState.js) | New: Auth state management and error handling |
| [src/auth/authDebug.js](src/auth/authDebug.js) | New: Debugging utilities |

---

## Testing Checklist

- [ ] Can you log in successfully?
- [ ] Token shows up in localStorage?
- [ ] Can you access the dashboard?
- [ ] Can you submit forgot password form?
- [ ] Do you see correct "Bearer" header in Network tab?

---

## If Still Not Working

1. **Check backend logs** for what error it's returning
2. **Verify token format** - should be JWT (3 parts separated by dots)
3. **Check backend configuration**:
   - Is CORS enabled for your frontend URL?
   - Are auth tokens properly validated?
   - Is the endpoint actually checking for the Authorization header?

4. **Test with curl** (check if backend is working):
```bash
# Test without token (should work for public endpoints)
curl https://myjobs-backend-b2y5.onrender.com/accounts/forgot-password/

# Test with token (adjust token value)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://myjobs-backend-b2y5.onrender.com/analytics/summary/
```

---

## Usage: Auth Debug Utilities

You now have helper functions to debug auth issues. Use in browser console:

```javascript
// Import the debug utilities (if set up in your app)
import authDebug from '@/auth/authDebug.js'

// Check auth status
authDebug.log()

// Decode and inspect token
authDebug.decodeToken()

// Check if token is expired
authDebug.isTokenExpired()

// Clear all tokens
authDebug.clear()
```

---

## Next Steps

1. Make sure you're **logged in**
2. **Refresh the page** and try again
3. **Clear browser cache** and restart
4. **Check browser console** for detailed error messages
5. **Verify backend is running** at the correct URL

If problems persist, check your backend logs to see exactly why it's rejecting the request!
