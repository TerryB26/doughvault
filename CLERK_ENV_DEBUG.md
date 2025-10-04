# Critical Clerk Authentication Fix

## Current Errors

1. **"auth() is only supported in App Router"** - This error is misleading. The real issue is Clerk can't initialize properly.
2. **"Cannot read properties of undefined (reading 'bind')"** - Clerk's internal auth object is undefined.
3. **"Infinite redirect loop"** - Session token refresh failing.

## Root Cause

The Clerk secret key is either:
- Not being loaded from `.env.local`
- Not matching the publishable key
- Corrupted or invalid

## Solution: Verify Environment Variables on Server

### Step 1: Check if .env.local is Being Read

On your server, run:

```bash
cd /root/B26_Warehouse/doughvault

# Check the file exists and has content
cat .env.local

# Check if Node can read it
node -e "require('dotenv').config({path: '.env.local'}); console.log('CLERK_SECRET_KEY:', process.env.CLERK_SECRET_KEY ? 'EXISTS' : 'MISSING'); console.log('PUBLISHABLE_KEY:', process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'EXISTS' : 'MISSING');"
```

### Step 2: Verify PM2 is Using the Correct Directory

```bash
# Check PM2 environment
pm2 show doughvault

# Look for "exec cwd" - should be /root/B26_Warehouse/doughvault
```

### Step 3: Add Environment Variables to PM2 Config

Edit `ecosystem.config.cjs` to explicitly include env vars:

```javascript
module.exports = {
  apps: [{
    name: 'doughvault',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 1835',
    cwd: '/root/B26_Warehouse/doughvault',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 1835,
      // Explicitly load from .env.local
    },
    env_file: '.env.local',  // Add this line
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
  }]
};
```

### Step 4: Alternative - Use PM2 Ecosystem with Explicit Env

Or update PM2 to load environment:

```bash
cd /root/B26_Warehouse/doughvault

# Stop PM2
pm2 stop doughvault
pm2 delete doughvault

# Start with explicit env file loading
pm2 start npm --name doughvault -- start --env-file .env.local

# Or manually set env vars
pm2 start npm --name doughvault --update-env -- start

# Save
pm2 save
```

### Step 5: Test Environment Loading

Create a test endpoint to verify env vars are loaded:

```bash
# On server
cd /root/B26_Warehouse/doughvault
cat > app/api/test-env/route.ts << 'EOF'
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasPublishableKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    hasSecretKey: !!process.env.CLERK_SECRET_KEY,
    publishableKeyPrefix: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 15),
    nodeEnv: process.env.NODE_ENV,
  });
}
EOF

# Rebuild
pm2 stop doughvault
rm -rf .next
npm run build
pm2 start ecosystem.config.cjs
pm2 save

# Test the endpoint
curl http://localhost:1835/api/test-env
```

## Quick Fix to Try First

The issue might be that PM2 isn't loading `.env.local`. Try this:

```bash
cd /root/B26_Warehouse/doughvault

# Stop PM2
pm2 stop doughvault
pm2 delete doughvault

# Start with explicit environment
export $(cat .env.local | xargs)
pm2 start ecosystem.config.cjs
pm2 save

# Check logs
pm2 logs doughvault
```

## Expected Output

After fixing, you should NOT see:
- ❌ "Cannot read properties of undefined (reading 'bind')"
- ❌ "Infinite redirect loop"

You SHOULD see:
- ✅ App starts without errors
- ✅ Login redirects to dashboard successfully
