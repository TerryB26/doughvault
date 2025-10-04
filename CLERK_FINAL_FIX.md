# Final Clerk Configuration Fix

## Current Issue
- Clerk returns HTTP 401 Unauthorized
- Cookies being rejected due to cross-site redirect
- "Infinite redirect loop" errors

## Root Cause
Clerk needs to be configured to allow your production domain (IP address).

## Solution Steps

### 1. Configure Clerk Dashboard

Go to: https://dashboard.clerk.com → Select "moral-tiger-41" instance

#### In "Domains" or "URLs" Section:
Add these exact URLs:

```
Application URL: http://185.220.204.117:1835
Allowed Origins: http://185.220.204.117:1835
```

#### In "Paths" Section:
```
Sign-in URL: /sign-in
Sign-up URL: /sign-up
After sign-in: /dashboard
After sign-up: /dashboard
```

### 2. Push and Deploy Code Updates

On your local machine:
```bash
git add app/layout.tsx
git commit -m "Add explicit publishableKey to ClerkProvider"
git push origin dev
```

On your server:
```bash
cd /root/B26_Warehouse/doughvault
pm2 stop doughvault
git pull origin dev
rm -rf .next
npm run build
pm2 start ecosystem.config.cjs
pm2 save
```

### 3. Clear Browser Cache

Before testing:
1. Open DevTools (F12)
2. Go to Application → Storage
3. Click "Clear site data"
4. Close browser completely
5. Reopen and test

### 4. Test Flow

1. Visit: `http://185.220.204.117:1835`
2. Click "Sign In"
3. Login: `system@doughvault.com` / `1234`
4. Should redirect to dashboard successfully

## If Still Getting 401 Errors

The issue might be that you're using development keys with domain restrictions. Options:

### Option A: Switch to Production Keys (Recommended)

1. In Clerk Dashboard, create a **Production** instance
2. Get production keys (`pk_live_...` and `sk_live_...`)
3. Update `.env.local` on server
4. Production instances have fewer restrictions

### Option B: Disable Domain Restrictions

1. In Clerk Dashboard → Settings
2. Look for "Domain restrictions" or "CORS settings"
3. Add `http://185.220.204.117:1835` to allowed domains

## Environment Variable Check

Your `.env.local` should have:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bW9yYWwtdGlnZXItNDEuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_dCM75ZG1xhZj56NKyubXAiPhdVebwpRGW3vZMGdXwk
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
DATABASE_URL="postgresql://postgres:@TerryB9003518@185.220.204.117:5432/doughvault"
DB_HOST=185.220.204.117
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=@TerryB9003518
DB_NAME=doughvault
DB_SSL=false
PORT=1835
```

No `AFTER_SIGN_IN_URL` or `AFTER_SIGN_UP_URL` variables!
