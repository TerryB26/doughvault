# 🚀 DoughVault - Quick Start Guide

## Prerequisites
- Node.js installed
- PostgreSQL database running
- Clerk account created

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Clerk

1. Go to https://clerk.com and create an account
2. Create a new application
3. Choose "Email" and "Password" as authentication methods
4. Copy your keys from the Clerk dashboard

### 3. Configure Environment Variables

Create `.env.local` in the root directory:

```env
# Clerk Keys (from Clerk Dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Database (adjust to your setup)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=doughvault
DB_USER=postgres
DB_PASSWORD=your_password
```

### 4. Set Up Database

```bash
# Initialize the database
npm run db:setup

# Or manually run the SQL files
psql -U postgres -d doughvault -f models/schema.sql
psql -U postgres -d doughvault -f models/seeder.sql
```

### 5. Start the Application

```bash
npm run dev
```

Visit: http://localhost:3000

### 6. Create Your Admin Account

1. Click "Sign Up" on the homepage
2. Enter your email and create a password
3. Complete the sign-up process
4. **Important**: Copy your Clerk User ID from the URL or Clerk dashboard

### 7. Add Yourself to Database as Admin

After signing up through Clerk, run these SQL commands:

```sql
-- Connect to your database
psql -U postgres -d doughvault

-- Add your user (replace with your details)
INSERT INTO users (clerkuserid, email, firstname, lastname, isactive)
VALUES (
  'user_2xxxxxxxxxxxxx',  -- Your Clerk User ID
  'your@email.com',
  'Your',
  'Name',
  true
);

-- Assign Admin role
INSERT INTO userroles (userid, roleid, isactive, assignedon)
VALUES (
  (SELECT userid FROM users WHERE email = 'your@email.com'),
  (SELECT roleid FROM roles WHERE rolename = 'Admin'),
  true,
  NOW()
);

-- Verify it worked
SELECT u.email, u.firstname, u.lastname, r.rolename
FROM users u
JOIN userroles ur ON u.userid = ur.userid
JOIN roles r ON ur.roleid = r.roleid
WHERE u.email = 'your@email.com';
```

### 8. Test Everything

1. **Refresh the page** after adding yourself as admin
2. Go to **/stock** - You should see Add, Edit, Delete buttons
3. Go to **/admin** - You should see all management features
4. Add a test item and check the audit trail

## Testing Different Roles

### Create a Manager User:
```sql
-- Change your role to Manager for testing
UPDATE userroles 
SET roleid = (SELECT roleid FROM roles WHERE rolename = 'Manager')
WHERE userid = (SELECT userid FROM users WHERE email = 'your@email.com');
```

**Expected behavior:**
- ✅ Can add and edit items
- ❌ Cannot delete items
- ❌ Cannot access user management

### Create a Staff User:
```sql
-- Change your role to Staff for testing
UPDATE userroles 
SET roleid = (SELECT roleid FROM roles WHERE rolename = 'Staff')
WHERE userid = (SELECT userid FROM users WHERE email = 'your@email.com');
```

**Expected behavior:**
- ✅ Can view items
- ✅ Can see audit trail
- ❌ Cannot add, edit, or delete

### Restore Admin:
```sql
-- Change back to Admin
UPDATE userroles 
SET roleid = (SELECT roleid FROM roles WHERE rolename = 'Admin')
WHERE userid = (SELECT userid FROM users WHERE email = 'your@email.com');
```

## Troubleshooting

### "User not found" after login
- Check if you added yourself to the `users` table
- Verify the `clerkuserid` matches your Clerk User ID
- Refresh the page after adding to database

### Buttons not showing/hiding correctly
- Check the `/api/users/current` endpoint in browser dev tools
- Verify your role is assigned correctly in database
- Clear browser cache and refresh

### Cannot access protected routes
- Verify `.env.local` has correct Clerk keys
- Check if you're signed in to Clerk
- Look for errors in browser console

### Database connection errors
- Verify PostgreSQL is running
- Check database credentials in `.env.local`
- Ensure database `doughvault` exists

## Quick Commands Reference

```bash
# Start development server
npm run dev

# Reset database (WARNING: Deletes all data)
npm run db:reset

# Seed database with sample data
npm run db:seed

# Check for linting errors
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## Where to Find Your Clerk User ID

### Method 1: After Sign-Up
- Look at the URL after signing up
- Should contain: `user_2xxxxxxxxxxxxx`

### Method 2: Clerk Dashboard
1. Go to your Clerk dashboard
2. Click "Users" in the sidebar
3. Click on your user
4. Copy the User ID

### Method 3: Browser Console
Add this temporarily to `app/page.tsx`:
```tsx
console.log('Clerk User ID:', userId);
```

## Need Help?

- Check `AUTHENTICATION_SETUP.md` for detailed auth setup
- Check `IMPLEMENTATION_SUMMARY.md` for feature overview
- Review `README.md` for project documentation

## You're Done! 🎉

Your DoughVault application is now ready with:
- ✅ Full authentication with Clerk
- ✅ Role-based access control
- ✅ Stock management
- ✅ Admin panel
- ✅ Audit trail system

Start adding your inventory items and invite your team! 🍕
