# EmailJS Quick Start Checklist

Complete these steps to get password reset emails working:

## ✅ Step 1: EmailJS Account Setup (5 minutes)
- [ ] Create account at https://www.emailjs.com
- [ ] Verify email
- [ ] Create an Email Service (Gmail/Outlook/etc.)
- [ ] Copy and save **Service ID**

## ✅ Step 2: Create Email Template (5 minutes)
- [ ] Create a new Email Template in EmailJS dashboard
- [ ] Add template variables:
  - `{{to_email}}`
  - `{{user_name}}`
  - `{{reset_link}}`
- [ ] Copy and save **Template ID**

## ✅ Step 3: Get API Keys (2 minutes)
- [ ] Go to Account → API Keys
- [ ] Copy and save **Public Key**

## ✅ Step 4: Configure Environment (2 minutes)
Create `.env.local` file in project root:
```env
VITE_EMAILJS_PUBLIC_KEY=paste_your_key_here
VITE_EMAILJS_SERVICE_ID=paste_your_service_id
VITE_EMAILJS_TEMPLATE_ID=paste_your_template_id
VITE_RESET_PASSWORD_URL=http://localhost:5173/reset-password
```

## ✅ Step 5: Verify Installation
- [ ] EmailJS package installed: `@emailjs/browser`
- [ ] Service file created: `src/service/emailService.js`
- [ ] ForgotPassword component updated: `src/auth/forgotPassword.jsx`

## ✅ Step 6: Test Locally
```bash
npm run dev
```
- [ ] Navigate to forgot password page
- [ ] Enter a test email
- [ ] Check inbox for test email
- [ ] Verify reset link works

## ✅ Step 7: Deploy (Production)
- [ ] Update `VITE_RESET_PASSWORD_URL` to production domain
- [ ] Set environment variables in your hosting platform
- [ ] Test password reset on production

---

## Configuration Locations

| File | Purpose |
|------|---------|
| `src/service/emailService.js` | EmailJS configuration & send functions |
| `src/auth/forgotPassword.jsx` | Updated to use EmailJS |
| `.env.local` | Local environment variables |
| `EMAILJS_SETUP.md` | Detailed setup guide |
| `EMAILJS_ADVANCED.md` | Advanced implementation options |

---

## Troubleshooting Quick Fixes

**Email not sending?**
- ✅ Check .env.local file for correct keys
- ✅ Verify service is connected in EmailJS dashboard
- ✅ Check browser console for errors

**Reset link not working?**
- ✅ Verify `VITE_RESET_PASSWORD_URL` is correct
- ✅ Check URL format includes token parameter
- ✅ Test URL in browser directly

**CORS errors?**
- ✅ You're using Public Key (correct)
- ✅ EmailJS handles CORS automatically
- ✅ Refresh page and try again

**Email in spam folder?**
- ✅ Add your email to contacts
- ✅ Improve email template (use professional format)
- ✅ Verify SPF/DKIM records for domain

---

## Next Steps

1. **Customize Email Template**
   - Make it match your brand
   - Add logo/images
   - Improve wording

2. **Enhance Security**
   - Implement rate limiting on backend
   - Add CAPTCHA to forgot password form
   - Validate token expiration

3. **Monitor & Log**
   - Track email sending failures
   - Log password reset attempts
   - Set up alerts for errors

4. **Test Scenarios**
   - Invalid email
   - Expired reset token
   - Multiple reset requests
   - Rate limiting

---

## Support & Resources

- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS React Integration](https://www.emailjs.com/docs/sdk/init/)
- [EmailJS Templates](https://www.emailjs.com/docs/user-guide/templates/)
- [EmailJS FAQ](https://www.emailjs.com/docs/faqs/)

---

## Important Security Reminders

⚠️ **DO NOT:**
- Store reset tokens in localStorage
- Expose Private Key in frontend code
- Use weak token generation
- Skip backend token validation

✅ **DO:**
- Use backend to generate tokens
- Implement token expiration (15-30 min)
- Validate tokens on backend before password change
- Use HTTPS in production
- Implement rate limiting
