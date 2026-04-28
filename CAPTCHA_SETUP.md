# CAPTCHA Integration Setup Guide

## Overview
This project uses **Google reCAPTCHA v3** for bot protection on login and registration endpoints. reCAPTCHA v3 is invisible to users and provides seamless protection.

---

## Setup Instructions

### 1. Get reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Click **"Create"** or **"+"** to create a new site
3. Fill in the form:
   - **Label**: Your app name (e.g., "E-commerce Site")
   - **reCAPTCHA type**: Select **reCAPTCHA v3**
   - **Domains**: 
     - Development: `localhost`
     - Production: Your domain (e.g., `yourdomain.com`)
4. Accept the terms and click **Submit**
5. You'll receive two keys:
   - **Site Key** (public) → Goes in frontend `.env`
   - **Secret Key** (private) → Goes in backend `.env`

---

## Environment Variables

### Backend (.env)

Add these variables to your backend `.env` file:

```env
# Required CAPTCHA Configuration
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here
RECAPTCHA_SCORE_THRESHOLD=0.5

# Optional: Adjust the score threshold based on your needs:
# 1.0 = very likely legitimate user
# 0.9 = likely legitimate
# 0.5 = neutral (default - recommended for most cases)
# 0.1 = likely bot
# 0.0 = very likely bot
```

**Important**: Never share your `RECAPTCHA_SECRET_KEY` publicly or commit it to version control.

### Frontend (.env)

Add this variable to your frontend `.env` file:

```env
# CAPTCHA Site Key (public - safe to expose)
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
```

---

## How It Works

### Frontend Flow
1. User fills in login/registration form
2. Before submission, reCAPTCHA v3 silently analyzes user behavior
3. A unique token is generated and sent with the request
4. User sees no CAPTCHA widget (invisible verification)

### Backend Flow
1. Receives CAPTCHA token from frontend
2. Sends token to Google's verification API
3. Google returns a score (0.0-1.0) indicating likelihood of legitimate user
4. If score ≥ threshold, user request proceeds
5. If score < threshold, request is rejected

### Response Codes

**Success (200)**
```json
{
  "success": true,
  "message": "User logged in successfully!",
  "token": "jwt_token_here",
  "user": {...}
}
```

**CAPTCHA Verification Failed (400)**
```json
{
  "success": false,
  "message": "CAPTCHA verification failed. Please try again.",
  "errors": ["error_codes_from_google"]
}
```

**Score Too Low (400)**
```json
{
  "success": false,
  "message": "CAPTCHA verification failed. Suspicious activity detected. Please try again."
}
```

---

## Testing

### Local Development
1. Add `localhost` to your reCAPTCHA domains in Google Admin Console
2. Use your development keys in `.env` files
3. The CAPTCHA will work transparently in your local environment

### Troubleshooting

| Issue | Solution |
|-------|----------|
| CAPTCHA token missing | Ensure `VITE_RECAPTCHA_SITE_KEY` is set in frontend `.env` |
| "Invalid secret key" | Check that `RECAPTCHA_SECRET_KEY` is correct and not expired |
| Always gets rejected | Lower the `RECAPTCHA_SCORE_THRESHOLD` value |
| Always gets accepted | Increase the `RECAPTCHA_SCORE_THRESHOLD` value |
| CORS errors | Ensure your frontend domain is in the CAPTCHA console allowed domains |

---

## Deployment

### Vercel Deployment

1. **Backend (Vercel)**
   - Go to Vercel project settings
   - Add environment variables:
     - `RECAPTCHA_SECRET_KEY` = your_secret_key
     - `RECAPTCHA_SCORE_THRESHOLD` = 0.5
   - Redeploy

2. **Frontend (Vercel)**
   - Go to Vercel project settings
   - Add environment variable:
     - `VITE_RECAPTCHA_SITE_KEY` = your_site_key
   - Redeploy

3. **Update reCAPTCHA Console**
   - Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
   - Edit your site
   - Add production domains:
     ```
     yourdomain.com
     www.yourdomain.com
     your-backend.vercel.app (if different)
     ```

---

## Security Best Practices

1. ✅ **Never commit `.env` files** with real keys
2. ✅ **Keep secret key private** - only use in backend
3. ✅ **Rotate keys periodically** if compromised
4. ✅ **Monitor reCAPTCHA analytics** for suspicious patterns
5. ✅ **Use HTTPS** in production
6. ✅ **Validate tokens immediately** after login attempt

---

## API Endpoints

### Login with CAPTCHA
```
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "captchaToken": "token_from_recaptcha"
}
```

### Register with CAPTCHA
```
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "captchaToken": "token_from_recaptcha"
}
```

---

## File Structure

```
backend/
├── middlewares/
│   └── captchamiddle.js       ← CAPTCHA verification middleware
├── controllers/
│   └── usercontroller.js      ← Updated with CAPTCHA check
├── routers/
│   └── userrouter.js          ← Routes with CAPTCHA middleware
└── .env                        ← CAPTCHA_SECRET_KEY & SCORE_THRESHOLD

frontend/
├── src/pages/
│   └── login.jsx              ← reCAPTCHA component integrated
└── .env                        ← VITE_RECAPTCHA_SITE_KEY
```

---

## Additional Resources

- [Google reCAPTCHA Documentation](https://developers.google.com/recaptcha/docs/v3)
- [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
- [reCAPTCHA Best Practices](https://developers.google.com/recaptcha/docs/v3#best_practices)
- [React reCAPTCHA Component](https://github.com/thedevelobear/react-google-recaptcha)

---

## License
This CAPTCHA implementation is part of your e-commerce project and follows the same license terms.
