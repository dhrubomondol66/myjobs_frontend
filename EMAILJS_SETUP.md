# EmailJS Setup Guide for Password Reset

This guide will help you integrate EmailJS to send password reset emails in your React application.

## 1. Create an EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com)
2. Sign up for a free account
3. Verify your email

## 2. Create an Email Service

1. In the EmailJS dashboard, go to **Email Services**
2. Click **Create New Service**
3. Choose your email provider:
   - **Gmail** (recommended)
   - **Outlook**
   - **SendGrid**
   - Or connect your own SMTP server
4. Follow the setup instructions for your provider
5. Save the **Service ID** (you'll need this later)

### For Gmail:
- Create an [App Password](https://support.google.com/accounts/answer/185833)
- Use your Gmail address as the sender
- Use the App Password (not your regular password)

## 3. Create an Email Template

1. Go to **Email Templates** in EmailJS dashboard
2. Click **Create New Template**
3. Configure your template:

### Example Template Variables:
```
To Email: {{to_email}}
Subject: Reset Your Password

Name: {{user_name}}
Reset Link: {{reset_link}}
Reset Code: {{reset_code}}
Expiry: {{expiry_time}}
```

### Example Template HTML:
```html
<h2>Password Reset Request</h2>
<p>Hi {{user_name}},</p>
<p>We received a request to reset your password. Click the link below to set a new password:</p>
<a href="{{reset_link}}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
  Reset Your Password
</a>
<p>Or use this code: <strong>{{reset_code}}</strong></p>
<p>This link will expire in {{expiry_time}}.</p>
<p>If you didn't request this, please ignore this email.</p>
```

4. Save the template and note the **Template ID**

## 4. Get Your Public Key

1. Go to **Account** → **API Keys**
2. Copy your **Public Key**

## 5. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_RESET_PASSWORD_URL=http://localhost:5173/reset-password
```

For production, update `VITE_RESET_PASSWORD_URL` to your actual domain:
```env
VITE_RESET_PASSWORD_URL=https://yourdomain.com/reset-password
```

## 6. How the Integration Works

### Flow:
1. User enters email on "Forgot Password" page
2. Backend validates the email exists (optional)
3. Backend generates reset token/code
4. Frontend calls `sendPasswordResetEmail()` via EmailJS
5. Email is sent with reset link/code
6. User clicks link and resets password

### Files Modified:
- `src/service/emailService.js` - EmailJS configuration and send functions
- `src/auth/forgotPassword.jsx` - Updated to use EmailJS

## 7. Usage Examples

### Send Email with Reset Link:
```javascript
import { sendPasswordResetEmail } from '../service/emailService.js'

await sendPasswordResetEmail(
  'user@example.com',
  'https://yourdomain.com/reset?token=abc123',
  'John'
)
```

### Send Email with Reset Code:
```javascript
import { sendPasswordResetCode } from '../service/emailService.js'

await sendPasswordResetCode(
  'user@example.com',
  '123456',
  'John'
)
```

## 8. Testing

1. Test locally with `npm run dev`
2. Enter your test email address
3. Check your inbox (and spam folder)
4. Click the reset link to verify it works

## 9. Troubleshooting

### Email not sending:
- Verify all environment variables are correct
- Check EmailJS dashboard for error logs
- Ensure your email service is properly connected
- Check spam/junk folder

### CORS Issues:
- EmailJS handles CORS automatically
- If you get CORS errors, make sure you're using the Public Key, not the Private Key

### Reset Link Not Working:
- Verify the `VITE_RESET_PASSWORD_URL` is correct
- Check that your reset token is being passed correctly
- Test the URL format in your browser

## 10. Best Practices

✅ Use a professional email template
✅ Include expiration time in emails
✅ Generate secure, random reset tokens on the backend
✅ Validate reset tokens on the backend before allowing password change
✅ Log email sending attempts for debugging
✅ Set reasonable token expiration times (15-30 minutes)
✅ Rate limit forgot password requests to prevent abuse

## 11. Security Considerations

- Never expose your Private Key in frontend code
- Always validate tokens on the backend
- Use HTTPS in production
- Implement rate limiting on forgot password endpoint
- Consider implementing CAPTCHA for additional security
