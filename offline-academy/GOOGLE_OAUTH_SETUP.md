# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the OfflineAcad application.

## Prerequisites

- A Google account
- Access to the Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on **Select a project** → **New Project**
3. Enter a project name (e.g., "OfflineAcad")
4. Click **Create**

## Step 2: Enable Google+ API

1. In your project, go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click on it and press **Enable**

## Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** (unless you have a Google Workspace account)
3. Click **Create**
4. Fill in the required information:
   - **App name**: OfflineAcad
   - **User support email**: Your email
   - **Developer contact information**: Your email
5. Click **Save and Continue**
6. On the **Scopes** page, click **Add or Remove Scopes**
7. Add these scopes:
   - `userinfo.email`
   - `userinfo.profile`
8. Click **Update** → **Save and Continue**
9. On **Test users**, add your email for testing
10. Click **Save and Continue** → **Back to Dashboard**

## Step 4: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Select **Web application**
4. Configure the following:
   - **Name**: OfflineAcad Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (for development)
     - Your production URL (e.g., `https://yourdomain.com`)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)
5. Click **Create**
6. **IMPORTANT**: Copy your **Client ID** and **Client Secret**

## Step 5: Update Environment Variables

1. Create a `.env.local` file in the `offline-academy` directory (if it doesn't exist)
2. Add the following variables:

```env
# Database
DATABASE_URL="your-database-url"

# JWT Secret
JWT_SECRET="your-jwt-secret-key-here"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Application
NEXT_PUBLIC_APP_NAME="OfflineAcad"
```

### Generate Secrets

For `NEXTAUTH_SECRET`, you can generate a secure random string using:

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

## Step 6: Run Database Migrations

Run the Prisma migration to update your database schema:

```bash
cd offline-academy
npx prisma generate
npx prisma migrate dev --name add_oauth_support
```

## Step 7: Test the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/login`

3. Click **"Sign in with Google"**

4. You should be redirected to Google's authentication page

5. Sign in with your Google account

6. After successful authentication, you'll be redirected back to the application

## Troubleshooting

### Error: "redirect_uri_mismatch"

- Make sure your redirect URI in Google Cloud Console exactly matches: `http://localhost:3000/api/auth/callback/google`
- Check that there are no trailing slashes
- Verify the protocol (http vs https)

### Error: "Access blocked: This app's request is invalid"

- Make sure you've enabled the Google+ API
- Check that your OAuth consent screen is configured
- Verify you've added your email as a test user

### Error: "Client ID not found"

- Double-check your `GOOGLE_CLIENT_ID` in `.env.local`
- Make sure there are no extra spaces or quotes

### Users not getting roles assigned

- By default, OAuth users are assigned the "STUDENT" role
- You can manually update user roles in the database if needed

## Production Deployment

Before deploying to production:

1. Add your production domain to **Authorized JavaScript origins** in Google Cloud Console
2. Add your production callback URL: `https://yourdomain.com/api/auth/callback/google`
3. Update `NEXTAUTH_URL` in your production environment variables
4. Make sure to use HTTPS in production
5. Submit your OAuth app for verification if you expect more than 100 users

## Security Best Practices

1. **Never commit** `.env.local` to version control
2. Use different OAuth clients for development and production
3. Regularly rotate your `NEXTAUTH_SECRET`
4. Monitor OAuth usage in Google Cloud Console
5. Implement rate limiting for authentication endpoints

## How It Works

1. User clicks "Sign in with Google"
2. They're redirected to Google's authentication page
3. User authorizes the app to access their basic profile information
4. Google redirects back to your app with an authorization code
5. NextAuth exchanges the code for access tokens
6. User information is saved to the database (if new user)
7. A session is created and the user is logged in

## Additional Features

### Accessing User Session

In your components, you can access the user session:

```tsx
import { useSession } from "next-auth/react";

export default function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>Not signed in</p>;
  
  return <p>Signed in as {session?.user?.email}</p>;
}
```

### Sign Out

```tsx
import { signOut } from "next-auth/react";

<button onClick={() => signOut()}>Sign Out</button>
```

## Support

If you encounter any issues, please:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure database migrations have been run
4. Check Google Cloud Console for any API usage limits or errors
