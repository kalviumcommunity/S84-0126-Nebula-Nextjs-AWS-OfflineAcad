# Quick Start: Google OAuth Setup

## 🚀 Fast Setup (5 Minutes)

### 1. Stop the dev server if running
```bash
# Press Ctrl+C
```

### 2. Update database schema
```bash
cd offline-academy
npx prisma generate
npx prisma migrate dev --name add_google_oauth
```

### 3. Get Google OAuth credentials

Visit [Google Cloud Console](https://console.cloud.google.com/):
1. Create a new project or select existing
2. Go to **APIs & Services** → **Credentials**
3. Click **Create Credentials** → **OAuth client ID**
4. Choose **Web application**
5. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy the **Client ID** and **Client Secret**

### 4. Create `.env.local` file

In the `offline-academy` folder, create `.env.local`:

```env
DATABASE_URL="your-existing-database-url"
JWT_SECRET="your-existing-jwt-secret"

# Generate this with: openssl rand -base64 32
NEXTAUTH_SECRET="put-a-random-string-here-at-least-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Paste from Google Cloud Console
GOOGLE_CLIENT_ID="your-client-id-here.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret-here"

NEXT_PUBLIC_APP_NAME="OfflineAcad"
```

### 5. Start the server
```bash
npm run dev
```

### 6. Test it!
1. Go to `http://localhost:3000/login`
2. Click **"Sign in with Google"**
3. Sign in with your Google account
4. You should be redirected to the dashboard!

## ✅ Done!

That's it! Google sign-in is now working.

For detailed setup instructions, see [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)

For implementation details, see [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
