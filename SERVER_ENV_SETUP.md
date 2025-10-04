# Server Environment Setup

## Missing Environment Variables on Server

Your server is missing the `.env.local` file with Clerk API keys. The build requires these to compile.

## Create .env.local on Server

Run this on your server:

```bash
cd /root/B26_Warehouse/doughvault
nano .env.local
```

Then paste this content (replace with your actual Clerk keys):

```bash
# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_KEY_HERE

# Clerk Routes
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Database Connection
DATABASE_URL="postgresql://postgres:@TerryB9003518@185.220.204.117:5432/doughvault"

# Application Port
PORT=1835
```

Save the file (Ctrl+O, Enter, Ctrl+X in nano)

## Get Your Clerk Keys

1. Go to: https://dashboard.clerk.com/last-active?path=api-keys
2. Copy your **Publishable Key** (starts with `pk_test_`)
3. Copy your **Secret Key** (starts with `sk_test_`)

## After Creating .env.local

```bash
# Build again
npm run build

# Start PM2
pm2 start ecosystem.config.cjs

# Save configuration
pm2 save

# Check logs
pm2 logs doughvault
```

## Security Note

⚠️ The `.env.local` file should contain:
- Clerk keys (from dashboard)
- Database URL (already have this from .env.database)
- Port number (1835)

**DO NOT commit .env.local to git** - it's already in .gitignore
