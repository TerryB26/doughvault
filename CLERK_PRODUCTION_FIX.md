# Clerk Production Fix

## Issues Identified

1. ❌ Using development keys in production (test keys starting with `pk_test_` and `sk_test_`)
2. ❌ Homepage (/) crashes with Server Components error
3. ❌ Deprecated `afterSignInUrl` and `afterSignUpUrl` props
4. ❌ Infinite redirect loop due to key mismatch
5. ⚠️ Using HTTP instead of HTTPS (security warning)

## Solution Steps

### 1. Get Production Keys from Clerk

You're currently using **development/test keys**. For production deployment:

1. Go to https://dashboard.clerk.com
2. Create a **Production** instance (or switch from Development to Production)
3. Get your **Production** keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - starts with `pk_live_` (NOT `pk_test_`)
   - `CLERK_SECRET_KEY` - starts with `sk_live_` (NOT `sk_test_`)

### 2. Update Server .env.local

Replace the test keys with production keys on your server:

```bash
cd /root/B26_Warehouse/doughvault
nano .env.local
```

Change from:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bW9yYWwtdGlnZXItNDEuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_dCM75ZG1xhZj56NKyubXAiPhdVebwpRGW3vZMGdXwk
```

To:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_PRODUCTION_KEY
CLERK_SECRET_KEY=sk_live_YOUR_PRODUCTION_KEY
```

### 3. Update Clerk Dashboard Settings

In your Clerk Dashboard (Production instance):

1. Go to **Paths** or **URLs** settings
2. Add these URLs:
   - **Application URL**: `http://185.220.204.117:1835`
   - **Sign-in URL**: `/sign-in`
   - **Sign-up URL**: `/sign-up`
   - **After sign-in URL**: `/dashboard`
   - **After sign-up URL**: `/dashboard`

### 4. Fix Homepage Error

The homepage is trying to use `auth()` which might be causing issues. Update needed.

### 5. Remove Deprecated Props

Need to update ClerkProvider to use new redirect props instead of deprecated ones.

### 6. Rebuild and Restart

After updating keys:

```bash
npm run build
pm2 restart doughvault
pm2 save
```

## Quick Fix Commands

```bash
# Stop PM2
pm2 stop doughvault

# Edit environment file (add production keys)
nano /root/B26_Warehouse/doughvault/.env.local

# Pull latest code fixes
git pull origin dev

# Rebuild with production keys
npm run build

# Start PM2
pm2 start ecosystem.config.cjs

# Save configuration
pm2 save

# Monitor logs
pm2 logs doughvault
```

## Expected Result

After fixing:
- ✅ Homepage loads without error
- ✅ Can sign in/sign up
- ✅ Redirects to dashboard work
- ✅ No infinite redirect loops
- ✅ No warnings about development keys

## Note About HTTPS

The password security warnings are because you're using HTTP instead of HTTPS. For production:
- Consider setting up HTTPS with Let's Encrypt/Certbot
- Or use Nginx reverse proxy with SSL
- This will remove the password security warnings
