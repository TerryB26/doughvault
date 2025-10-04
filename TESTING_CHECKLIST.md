# ✅ DoughVault - Testing Checklist

## Pre-Testing Setup
- [ ] Clerk account created
- [ ] API keys added to `.env.local`
- [ ] Database running
- [ ] Database schema and seeder executed
- [ ] Application running (`npm run dev`)

## Authentication Testing

### Sign Up Flow
- [ ] Homepage loads without errors
- [ ] "Sign Up" link is visible
- [ ] Click "Sign Up" opens Clerk sign-up page
- [ ] Can create account with email/password
- [ ] After sign-up, redirects to /dashboard
- [ ] User added to database with Clerk ID
- [ ] Admin role assigned in database

### Sign In Flow
- [ ] Sign out works
- [ ] "Sign In" link is visible on homepage
- [ ] Click "Sign In" opens Clerk sign-in page
- [ ] Can sign in with credentials
- [ ] After sign-in, redirects to /dashboard
- [ ] User data loads correctly

### Protected Routes
- [ ] Accessing /dashboard without login → redirects to sign-in
- [ ] Accessing /admin without login → redirects to sign-in
- [ ] Accessing /stock without login → redirects to sign-in
- [ ] After login, can access all protected pages

## Stock Management Testing (As Admin)

### View Items
- [ ] Stock page loads with items table
- [ ] Summary cards show correct counts
- [ ] Status chips colored correctly (green/orange/red)
- [ ] Search works
- [ ] Category filter works
- [ ] Status filter works
- [ ] Pagination works
- [ ] Stock level progress bars display

### Add Item
- [ ] "Add New Item" button is visible
- [ ] Click opens modal with form
- [ ] All fields present (name, category, quantity, etc.)
- [ ] Category dropdown populated
- [ ] Unit dropdown populated
- [ ] Can submit form successfully
- [ ] Success notification appears
- [ ] Table refreshes with new item
- [ ] Summary cards update

### Edit Item
- [ ] Edit button (blue) visible on each row
- [ ] Click opens modal with populated data
- [ ] Category dropdown shows current value
- [ ] Unit dropdown shows current value
- [ ] Can change values
- [ ] Can submit changes successfully
- [ ] Success notification appears
- [ ] Table updates immediately
- [ ] Audit trail records the change

### Delete Item
- [ ] Delete button (red) visible on each row
- [ ] Click shows confirmation dialog
- [ ] Can confirm deletion
- [ ] Success notification appears
- [ ] Item removed from table
- [ ] Summary cards update

### View Item Details
- [ ] View button (green) visible on each row
- [ ] Click opens modal with tabs
- [ ] "Details" tab shows:
  - [ ] Item name and category
  - [ ] SKU chip
  - [ ] Current stock and reorder threshold
  - [ ] Stock level progress bar
  - [ ] Unit cost and total value
  - [ ] Supplier and storage location
- [ ] "Audit Trail" tab shows:
  - [ ] List of changes if any exist
  - [ ] "No audit trail" message if empty
  - [ ] Action chips (INSERT/UPDATE/DELETE)
  - [ ] User who made change
  - [ ] Formatted date/time
  - [ ] Old → New value changes
  - [ ] Readable timestamps

## Admin Panel Testing (As Admin)

### Users Management
- [ ] Users tab loads with users table
- [ ] "Add New User" button visible
- [ ] Search works
- [ ] Status filter works
- [ ] Can sort by clicking headers
- [ ] Edit button visible on each row
- [ ] Delete button visible on each row
- [ ] Can add new user
- [ ] Can edit existing user
- [ ] Can delete user
- [ ] Pagination works

### Roles Management
- [ ] Roles tab loads with roles table
- [ ] "Add New Role" button visible
- [ ] Search works
- [ ] Status filter works
- [ ] Can add new role
- [ ] Can edit existing role
- [ ] Can toggle role active/inactive
- [ ] User count displays correctly

### User Role Assignments
- [ ] User Roles tab loads with assignments table
- [ ] "Assign Role" button visible
- [ ] User filter works
- [ ] Role filter works
- [ ] Status filter works
- [ ] Can assign role to user
- [ ] Can edit role assignment
- [ ] Can toggle assignment active/inactive
- [ ] Can delete assignment
- [ ] Changes reflect immediately

## Role-Based Access Control Testing

### Test as Manager
```sql
UPDATE userroles 
SET roleid = (SELECT roleid FROM roles WHERE rolename = 'Manager')
WHERE userid = (SELECT userid FROM users WHERE email = 'your@email.com');
```

After refresh:
- [ ] Stock page: "Add New Item" button visible ✅
- [ ] Stock page: Edit buttons visible ✅
- [ ] Stock page: Delete buttons NOT visible ❌
- [ ] Admin page: All buttons NOT visible ❌
- [ ] Can view audit trails ✅

### Test as Staff
```sql
UPDATE userroles 
SET roleid = (SELECT roleid FROM roles WHERE rolename = 'Staff')
WHERE userid = (SELECT userid FROM users WHERE email = 'your@email.com');
```

After refresh:
- [ ] Stock page: "Add New Item" button NOT visible ❌
- [ ] Stock page: Edit buttons NOT visible ❌
- [ ] Stock page: Delete buttons NOT visible ❌
- [ ] Stock page: View buttons visible ✅
- [ ] Admin page: No access or read-only
- [ ] Can view audit trails ✅

### Restore to Admin
```sql
UPDATE userroles 
SET roleid = (SELECT roleid FROM roles WHERE rolename = 'Admin')
WHERE userid = (SELECT userid FROM users WHERE email = 'your@email.com');
```

After refresh:
- [ ] All buttons visible again ✅

## API Endpoints Testing

### Test with Browser Dev Tools

1. Open Network tab
2. Perform actions
3. Verify responses:

- [ ] `/api/users/current` returns user with roles
- [ ] `/api/items` returns items array
- [ ] `/api/items/logs?itemId=X` returns audit logs
- [ ] `/api/roles` returns roles array
- [ ] `/api/users` returns users array
- [ ] `/api/user-roles` returns assignments array
- [ ] `/api/inventory/summary` returns summary stats

## Error Handling Testing

- [ ] Try submitting empty form → Shows validation errors
- [ ] Try deleting item in use → Shows error message
- [ ] Try accessing API without auth → Returns 401
- [ ] Network error handling works
- [ ] Loading states show correctly

## Browser Compatibility

- [ ] Chrome - Works correctly
- [ ] Firefox - Works correctly
- [ ] Safari - Works correctly
- [ ] Edge - Works correctly

## Mobile Responsiveness

- [ ] Homepage responsive
- [ ] Sign-in page responsive
- [ ] Dashboard responsive
- [ ] Stock page table scrolls horizontally if needed
- [ ] Admin page table scrolls horizontally if needed
- [ ] Modals fit on mobile screens

## Performance Testing

- [ ] Page loads in under 3 seconds
- [ ] Tables handle 100+ rows smoothly
- [ ] No console errors
- [ ] No console warnings
- [ ] React Query devtools working

## Security Testing

- [ ] Cannot access protected routes when logged out
- [ ] Cannot see admin pages as Staff user
- [ ] Cannot delete as Manager user
- [ ] API endpoints return 401 without auth
- [ ] Clerk session expires and requires re-login
- [ ] Environment variables not exposed to client

## Final Checks

- [ ] No TypeScript errors in code
- [ ] No ESLint errors
- [ ] All imports resolved
- [ ] All data types correct
- [ ] All functions working as expected
- [ ] Documentation is clear and complete

## Known Issues (if any)

Document any issues found:

1. Issue: ___________________________
   Status: [ ] Fixed [ ] In Progress [ ] Deferred
   
2. Issue: ___________________________
   Status: [ ] Fixed [ ] In Progress [ ] Deferred

## Sign-Off

- [ ] All critical features tested and working
- [ ] All role permissions verified
- [ ] Documentation complete
- [ ] Ready for team onboarding
- [ ] Ready for production deployment

**Tested by:** _________________
**Date:** _________________
**Status:** [ ] PASS [ ] FAIL

---

## Notes:

(Add any additional observations or comments here)

