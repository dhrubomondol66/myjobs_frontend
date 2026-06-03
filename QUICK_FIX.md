# Quick Reference - Network Timeout Error

## Your Error
```
timeout of 10000ms exceeded on POST /accounts/forgot-password/
```

## What This Means
The backend server is **not responding** within 10 seconds (now increased to 15 seconds).

---

## 3 Quick Fixes (Try These First)

### Fix 1: Restart Your Backend
```bash
# If using Render.com:
# 1. Go to https://dashboard.render.com
# 2. Find your backend service
# 3. Click "Manual Deploy" or "Restart"
```

### Fix 2: Hard Refresh Your App
```
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

### Fix 3: Check if Backend is Running

In browser console:
```javascript
fetch('https://myjobs-backend-b2y5.onrender.com/health/')
  .then(r => console.log('✅ OK:', r.status))
  .catch(e => console.error('❌ OFFLINE:', e.message))
```

---

## If Backend is Offline

### Check Render.com Status:
1. Go to https://dashboard.render.com
2. Click your backend service
3. Check "Logs" tab for errors
4. Click "Manual Deploy" to restart

### Common Causes on Render.com Free Tier:
- ⏰ Spins down after 15 min inactivity
- 💾 Database not connected
- 🔴 Service crashed

---

## Run Full Diagnostics

In browser console, run:

```javascript
import { networkDiagnostics } from './src/service/networkDiagnostics.js'
networkDiagnostics.runFullDiagnostics()
```

Then **share the output** - it will show exactly what's wrong.

---

## What Was Changed

| File | Update |
|------|--------|
| api.js | Timeout increased 10s → 15s, better errors |
| networkDiagnostics.js | ✨ NEW - Test backend connectivity |
| TROUBLESHOOTING_TIMEOUT.md | ✨ NEW - Detailed guide |

---

## Summary

**Status**: 🔴 Backend is not responding

**Action**: 
1. Check if backend is running
2. Restart if needed
3. Run diagnostics
4. Check Render.com logs

**Expected**: 🟢 Backend responds within 15 seconds

---

## Docs

- [TROUBLESHOOTING_TIMEOUT.md](TROUBLESHOOTING_TIMEOUT.md) - Full troubleshooting guide
- [TROUBLESHOOTING_401.md](TROUBLESHOOTING_401.md) - Auth errors
- [FIX_SUMMARY.md](FIX_SUMMARY.md) - Previous fixes

---

**Next Step**: Test your backend connectivity now!
