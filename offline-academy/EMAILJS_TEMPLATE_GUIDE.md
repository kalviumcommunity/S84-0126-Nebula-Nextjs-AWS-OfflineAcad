# EmailJS Template Configuration Guide

## Template Variables

The application sends OTP emails using EmailJS. Ensure your EmailJS template uses these exact variable names:

### Required Template Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `{{email}}` | User's email address | user@example.com |
| `{{name}}` | User's name or "User" as fallback | John Doe |
| `{{otp}}` | 6-digit OTP code | 123456 |

### Environment Variables Required

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

### Example EmailJS Template

```html
Hello {{name}},

Your OTP code is: {{otp}}

This code is valid for 10 minutes.

If you didn't request this code, please ignore this email.

Thank you!
```

## Important Notes

1. **Variable Names Must Match**: The template variables in EmailJS must exactly match `{{email}}`, `{{name}}`, and `{{otp}}`
2. **Client-Side Only**: EmailJS is used in the client component ([login/page.tsx](src/app/(auth)/login/page.tsx))
3. **OTP Generation**: OTP is generated server-side in [api/auth/send-otp/route.ts](src/app/api/auth/send-otp/route.ts)
4. **Email Sending**: Email is sent client-side after receiving the OTP from the API

## Troubleshooting

### If OTP emails are not being sent:

1. Check browser console for EmailJS errors
2. Verify environment variables are set correctly
3. Confirm EmailJS template variable names match exactly
4. Check EmailJS dashboard for service status
5. Verify the service ID, template ID, and public key are correct

### Common Issues:

- **422 Error**: Template variable mismatch - check that your EmailJS template uses `{{email}}`, `{{name}}`, and `{{otp}}`
- **Configuration Missing**: Verify all three environment variables are set
- **CORS Error**: Check EmailJS domain whitelist settings
