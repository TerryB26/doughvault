# Clean Environment Configuration for Server

Copy this EXACT content to your server's .env.local file:

```bash
# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bW9yYWwtdGlnZXItNDEuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_dCM75ZG1xhZj56NKyubXAiPhdVebwpRGW3vZMGdXwk

# Clerk Routes (DO NOT use AFTER_SIGN_IN_URL - it's deprecated)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Database Configuration
DATABASE_URL="postgresql://postgres:@TerryB9003518@185.220.204.117:5432/doughvault"
DB_HOST=185.220.204.117
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=@TerryB9003518
DB_NAME=doughvault
DB_SSL=false

# Application Port
PORT=1835
```

## Steps to Fix Infinite Redirect Loop:

1. **Verify keys match in Clerk Dashboard:**
   - Go to: https://dashboard.clerk.com
   - Click on your instance: "moral-tiger-41" (or your active instance)
   - Go to: **API Keys** section
   - Copy BOTH keys from the SAME instance
   - Make sure the publishable key and secret key are from the SAME Clerk instance

2. **Update server .env.local:**
   ```bash
   cd /root/B26_Warehouse/doughvault
   nano .env.local
   ```
   - Delete ALL content
   - Paste the clean config above
   - Save and exit (Ctrl+O, Enter, Ctrl+X)

3. **Verify the file:**
   ```bash
   cat .env.local
   ```

4. **Restart PM2:**
   ```bash
   pm2 restart doughvault
   pm2 logs doughvault
   ```

## Common Causes of Infinite Redirect:

1. ❌ Using publishable key from one Clerk instance and secret key from another
2. ❌ Having both old (`AFTER_SIGN_IN_URL`) and new redirect props causing conflicts
3. ❌ Keys don't match what's in your Clerk dashboard
4. ❌ Using development keys when instance is set to production (or vice versa)

## To Double-Check Your Keys:

Run this on your server:
```bash
cat /root/B26_Warehouse/doughvault/.env.local | grep CLERK
```

The output should show:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bW9yYWwtdGlnZXItNDEuY2xlcmsuYWNjb3VudHMuZGV2JA`
- `CLERK_SECRET_KEY=sk_test_dCM75ZG1xhZj56NKyubXAiPhdVebwpRGW3vZMGdXwk`
- Only `/sign-in` and `/sign-up` URLs (NO `AFTER_` urls)
