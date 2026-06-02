# EmailJS Advanced Implementation Guide

## Implementation Options

### Option 1: Backend Validation + EmailJS Frontend Sending (RECOMMENDED)

**How it works:**
1. Frontend submits email to backend
2. Backend validates email exists and generates reset token
3. Backend sends response with token
4. Frontend uses EmailJS to send reset email with token

**Pros:**
- ✅ Secure - backend controls token generation
- ✅ Email verification - only valid users get emails
- ✅ Server keeps audit log of reset requests

**Cons:**
- ❌ Requires backend changes
- ❌ More complex setup

**Code (Already implemented in forgotPassword.jsx):**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')
  setSubmitting(true)
  try {
    // Backend validates email and generates token
    const response = await forgotPassword({ email })
    
    // Frontend sends email via EmailJS
    const resetToken = response?.data?.reset_token
    const resetLink = `${import.meta.env.VITE_RESET_PASSWORD_URL}?token=${resetToken}`
    
    await sendPasswordResetEmail(email, resetLink, email.split('@')[0])
    setSent(true)
  } catch (err) {
    setError(err?.response?.data?.message || 'Failed to send reset email')
  } finally {
    setSubmitting(false)
  }
}
```

---

### Option 2: Frontend-Only with EmailJS (SIMPLE)

**How it works:**
1. Frontend generates a random reset code/token
2. Frontend sends reset email directly via EmailJS
3. User submits reset code on reset page
4. Backend validates code and allows password reset

**Pros:**
- ✅ Simple setup
- ✅ No backend changes needed
- ✅ Fast implementation

**Cons:**
- ❌ Less secure - token generated client-side
- ❌ No email verification
- ❌ Anyone can send reset emails

**Implementation:**
```javascript
import { useState } from 'react'
import { sendPasswordResetEmail } from '../service/emailService.js'

// Generate a random reset code
const generateResetCode = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')
  setSubmitting(true)
  try {
    const resetCode = generateResetCode()
    
    // Send email with reset code
    await sendPasswordResetEmail(
      email,
      `${import.meta.env.VITE_RESET_PASSWORD_URL}?code=${resetCode}`,
      email.split('@')[0]
    )
    
    // Store code temporarily (not recommended for production)
    sessionStorage.setItem('resetCode', resetCode)
    setSent(true)
  } catch (err) {
    setError(err?.message || 'Failed to send reset email')
  } finally {
    setSubmitting(false)
  }
}
```

---

### Option 3: Backend Sends Email, Frontend Only Triggers (SAFEST)

**How it works:**
1. Frontend submits email to backend
2. Backend validates email and sends email directly
3. Frontend shows confirmation message

**Pros:**
- ✅ Most secure
- ✅ Backend controls everything
- ✅ Easy audit trail

**Cons:**
- ❌ Backend needs EmailJS setup
- ❌ Requires backend changes
- ❌ Can't customize emails from frontend

**Implementation (Backend Example - Node.js):**
```javascript
// In your backend
const nodemailer = require('nodemailer');

app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  // Validate email exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'Email not found' });
  }
  
  // Generate reset token
  const resetToken = generateSecureToken();
  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 30 * 60 * 1000; // 30 minutes
  await user.save();
  
  // Send email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  const resetLink = `https://yourdomain.com/reset?token=${resetToken}`;
  
  await transporter.sendMail({
    to: email,
    subject: 'Reset Your Password',
    html: `<a href="${resetLink}">Reset Password</a>`
  });
  
  res.json({ message: 'Reset email sent' });
});
```

---

## Comparison Table

| Feature | Option 1 | Option 2 | Option 3 |
|---------|----------|----------|----------|
| Security | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Complexity | Medium | Low | Medium |
| Backend Required | Yes | No | Yes |
| Email Verification | Yes | No | Yes |
| Customizable Emails | Yes | Yes | No |
| Setup Time | 30 min | 15 min | 1 hour |

---

## Recommended Approach: Option 1

We recommend Option 1 because it provides:
- Strong security with backend-generated tokens
- Email verification (prevents spam)
- Audit trail of reset attempts
- Customizable emails via frontend template variables

---

## Helper Function: Generate Secure Token (Backend)

```javascript
// Node.js/Express backend
const crypto = require('crypto');

function generateSecureResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

function generateResetCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
}

module.exports = { generateSecureResetToken, generateResetCode };
```

---

## Helper Function: Token Validation (Backend)

```javascript
// Validate reset token before allowing password change
async function validateResetToken(token) {
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() } // Token not expired
  });
  
  if (!user) {
    throw new Error('Invalid or expired reset token');
  }
  
  return user;
}

// Usage in reset password endpoint
app.post('/api/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  
  try {
    const user = await validateResetToken(token);
    user.password = await hashPassword(newPassword);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

---

## Rate Limiting (Prevent Abuse)

```javascript
// Implement rate limiting on forgot password endpoint
const rateLimit = require('express-rate-limit');

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes
  message: 'Too many password reset attempts, please try again later'
});

app.post('/api/forgot-password', forgotPasswordLimiter, async (req, res) => {
  // ... your code
});
```

---

## Environment Variables Reference

```env
# EmailJS Configuration
VITE_EMAILJS_PUBLIC_KEY=pk_xxxxxxxxxxxxxxxxxxxxxxxx
VITE_EMAILJS_SERVICE_ID=service_xxxxxxxxxxxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxxxxxxxxxxx

# URLs
VITE_RESET_PASSWORD_URL=https://yourdomain.com/reset-password
VITE_API_BASE_URL=https://api.yourdomain.com

# Backend (if using Option 3)
EMAIL_SERVICE=gmail
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASSWORD=your_app_password_here
```

---

## Monitoring & Logging

Add logging to track reset attempts:

```javascript
// In emailService.js
export const sendPasswordResetEmail = async (email, resetLink, userName) => {
  const startTime = Date.now();
  
  try {
    const response = await emailjs.send(...)
    console.log(`[EMAIL_SENT] To: ${email}, Duration: ${Date.now() - startTime}ms`);
    return response;
  } catch (error) {
    console.error(`[EMAIL_ERROR] To: ${email}, Error: ${error.message}`);
    throw error;
  }
};
```
