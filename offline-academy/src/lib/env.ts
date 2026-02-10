export const env = {
  appName: process.env.NEXT_PUBLIC_APP_NAME!,
  jwtSecret: process.env.JWT_SECRET!,
  databaseUrl: process.env.DATABASE_URL!,
  nextAuthSecret: process.env.NEXTAUTH_SECRET!,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
};

Object.entries(env).forEach(([key, value]) => {
  if (!value && key !== 'googleClientId' && key !== 'googleClientSecret') {
    throw new Error(`Missing environment variable: ${key}`);
  }
});