# Server Deployment Fix

## Issue
The `.next/prerender-manifest.json` file is missing because the build didn't complete successfully or the `.next` folder wasn't created properly.

## Solution

Run these commands on your server in order:

```bash
# 1. Stop PM2 to free up resources
pm2 stop doughvault

# 2. Navigate to your project directory (if not already there)
cd /root/B26_Warehouse/doughvault

# 3. Remove the old .next folder completely
rm -rf .next

# 4. Verify you have the latest code
git status
git pull origin dev

# 5. Install dependencies (in case something is missing)
npm install

# 6. Build the application (this should complete successfully now)
npm run build

# 7. Once build completes, start PM2
pm2 start ecosystem.config.cjs

# 8. Save the PM2 configuration
pm2 save

# 9. Check the logs
pm2 logs doughvault --lines 50
```

## Quick One-Liner

```bash
pm2 stop doughvault && cd /root/B26_Warehouse/doughvault && rm -rf .next && git pull origin dev && npm install && npm run build && pm2 start ecosystem.config.cjs && pm2 save
```

## What to Watch For

When running `npm run build`, you should see:
- ✓ Compiled successfully
- Route generation (21 routes)
- Build output statistics
- No error messages

If the build fails, check for:
- Missing environment variables (.env.local file with Clerk keys)
- Node version (should be 18+)
- Available disk space
- Memory issues (the build might need more RAM)

## Environment Variables Required

Make sure `/root/B26_Warehouse/doughvault/.env.local` contains:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
DATABASE_URL=postgresql://...
PORT=1835
```
