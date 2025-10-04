# DoughVault - Authentication & Authorization Setup

## Authentication Implementation Summary

### ✅ Completed Features

1. **Clerk Authentication Integration**
   - ClerkProvider wrapped around the app
   - Protected routes middleware for dashboard, admin, and stock pages
   - Sign-in/Sign-up pages configured
   - Auto-redirect authenticated users to dashboard

2. **Role-Based Access Control (RBAC)**
   - Custom `useAuth` hook with role checking
   - Three role levels: Admin, Manager, Staff
   - Permission matrix:
     - **Admin**: Full access (create, edit, delete all)
     - **Manager**: Can create and edit (no delete)
     - **Staff**: View-only access

3. **Protected UI Elements**
   - **Stock Management Page**:
     - "Add New Item" button: Hidden for Staff
     - Edit button: Hidden for Staff
     - Delete button: Admin only
   
   - **Admin Panel**:
     - "Add New User" button: Admin only
     - "Add New Role" button: Admin only
     - "Assign Role" button: Admin only
     - Edit buttons: Managers and Admins
     - Delete buttons: Admin only
     - Toggle status buttons: Admin only

4. **Audit Trail**
   - Item change history with tabs in view modal
   - Displays who changed what and when
   - Formatted timestamps and change comparisons

## Setup Instructions

### 1. Set Up Clerk Account

1. Go to [Clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Copy your API keys

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=doughvault
DB_USER=postgres
DB_PASSWORD=your_password
```

### 3. Database Setup

The database already has the required tables. Make sure you have:
- Users table with `clerkuserid` column
- Roles table with Admin, Manager, Staff roles
- UserRoles junction table
- ItemsLogs audit table

### 4. Initial User Setup

After signing up through Clerk, you need to:

1. **Add user to database**:
```sql
INSERT INTO users (clerkuserid, email, firstname, lastname, isactive)
VALUES ('user_xxxxx', 'your@email.com', 'Your', 'Name', true);
```

2. **Assign Admin role**:
```sql
-- Get the user ID
SELECT userid FROM users WHERE email = 'your@email.com';

-- Assign Admin role
INSERT INTO userroles (userid, roleid, isactive, assignedon)
VALUES (
  (SELECT userid FROM users WHERE email = 'your@email.com'),
  (SELECT roleid FROM roles WHERE rolename = 'Admin'),
  true,
  NOW()
);
```

### 5. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000`

## Testing Authentication

### Test Plan

1. **Sign Up Flow**
   - Visit homepage
   - Click "Sign Up"
   - Create account with email
   - Should redirect to dashboard after sign up

2. **Sign In Flow**
   - Sign out
   - Visit homepage
   - Click "Sign In"
   - Enter credentials
   - Should redirect to dashboard

3. **Protected Routes**
   - Try accessing `/dashboard` without login → Should redirect to sign-in
   - Try accessing `/admin` without login → Should redirect to sign-in
   - Try accessing `/stock` without login → Should redirect to sign-in

4. **Role-Based UI (Staff User)**
   - Assign Staff role to test user
   - Visit stock page
   - Should NOT see: Add button, Edit buttons, Delete buttons
   - Should see: View button only

5. **Role-Based UI (Manager User)**
   - Assign Manager role
   - Visit stock page
   - Should see: Add button, Edit buttons
   - Should NOT see: Delete buttons

6. **Role-Based UI (Admin User)**
   - Assign Admin role
   - Should see ALL buttons and functions

## API Routes Protection

All API routes under these paths require authentication:
- `/api/items/*`
- `/api/users/*`
- `/api/roles/*`
- `/api/user-roles/*`
- `/api/inventory/*`

## Troubleshooting

### User not found after sign-up
- Check if Clerk user ID was added to database
- Verify email matches between Clerk and database

### Roles not working
- Check UserRoles table for active assignments
- Verify role names match exactly: 'Admin', 'Manager', 'Staff'

### Buttons still showing for wrong roles
- Clear browser cache
- Check `/api/users/current` endpoint response
- Verify useUserRoles hook is imported and used

## Security Notes

- Never commit `.env.local` to git
- Keep Clerk secret keys secure
- Regularly audit user roles and permissions
- Review ItemsLogs for suspicious activity

## Next Steps

- [ ] Set up Clerk account and get API keys
- [ ] Create `.env.local` with your keys
- [ ] Test sign up flow
- [ ] Add yourself as Admin user in database
- [ ] Test different role permissions
- [ ] Invite team members and assign appropriate roles

