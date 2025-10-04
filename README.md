# 🍕 DoughVault - Pizza Shop Inventory Management System

A modern, full-stack inventory management system built with Next.js 15, featuring role-based access control, real-time updates, and comprehensive audit trails.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **Clerk Account** (for authentication)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication (Get these from https://clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

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

### 3. Set Up Database

**Option A: Initialize Database (First Time Setup)**
```bash
npm run db:setup
```

**Option B: Reset Database (Clear All Data & Reseed)**
```bash
npm run db:reset
```

This will create:
- All database tables (Users, Roles, Items, Categories, etc.)
- Pre-configured roles (Admin, Manager, Staff, Viewer)
- Sample inventory items
- Test user accounts (see below)

### 4. Create Clerk Accounts

**Important:** Before you can log in, you must create Clerk accounts for the seeded users:

1. Go to your Clerk Dashboard (https://dashboard.clerk.com)
2. Create accounts with the following emails:
   - `system@doughvault.com`
   - `mario@pizzashop.com`
   - `luigi@pizzashop.com`
   - `anna@pizzashop.com`

3. Use password: **`1234`** for all test accounts

4. After creating each account in Clerk, the system will automatically link them to the database users.

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Test User Accounts

After seeding and creating Clerk accounts, you can log in with these users:

### Admin User
- **Email:** `system@doughvault.com`
- **Password:** `1234`
- **Role:** Admin
- **Permissions:** Full access to all features
  - ✅ Manage users, roles, and assignments
  - ✅ Add, edit, delete inventory items
  - ✅ View audit trails
  - ✅ Access administration panel

### Manager User
- **Email:** `mario@pizzashop.com`
- **Password:** `1234`
- **Role:** Manager
- **Permissions:** Edit access
  - ✅ Add and edit inventory items
  - ❌ Cannot delete items
  - ❌ Cannot access administration panel
  - ✅ View audit trails

### Staff Users

**Luigi (Staff)**
- **Email:** `luigi@pizzashop.com`
- **Password:** `1234`
- **Role:** Staff
- **Permissions:** Read-only
  - ✅ View inventory items
  - ✅ View audit trails
  - ❌ Cannot add, edit, or delete
  - ❌ Cannot access administration panel

**Anna (Staff)**
- **Email:** `anna@pizzashop.com`
- **Password:** `1234`
- **Role:** Staff
- **Permissions:** Read-only (same as Luigi)

---

## 📚 Features

### 🔐 Authentication & Authorization
- Secure authentication with Clerk
- Role-based access control (RBAC)
- Protected routes and API endpoints
- Session management

### 📦 Inventory Management
- Add, edit, delete inventory items
- Real-time stock level tracking
- Low stock alerts with visual indicators
- Category-based organization
- SKU and supplier management

### 👨‍💼 Administration Panel (Admin Only)
- User management (CRUD operations)
- Role management
- User role assignments
- Activity monitoring

### 📊 Dashboard
- Inventory summary statistics
- Low stock count
- Total inventory value
- Quick access to key features

### 🔍 Audit Trail
- Complete change history for all items
- Track who changed what and when
- Old vs new value comparisons
- Formatted timestamps

### 🎨 Modern UI
- Material-UI components
- Responsive design
- Color-coded status indicators
- Intuitive navigation

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15.5.4 with Turbopack
- **Frontend:** React 19, Material-UI 7
- **State Management:** TanStack React Query 5
- **Authentication:** Clerk
- **Database:** PostgreSQL with JSONB support
- **Styling:** Material-UI with custom theming
- **Notifications:** SweetAlert2
- **Language:** TypeScript

---

## 📖 Available Scripts

```bash
# Start development server (with Turbopack)
npm run dev

# Initialize database (first time)
npm run db:setup

# Reset database (clear all data and reseed)
npm run db:reset

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

---

## 🔑 Permission Matrix

| Feature | Admin | Manager | Staff |
|---------|-------|---------|-------|
| View Stock | ✅ | ✅ | ✅ |
| Add Item | ✅ | ✅ | ❌ |
| Edit Item | ✅ | ✅ | ❌ |
| Delete Item | ✅ | ❌ | ❌ |
| View Audit Trail | ✅ | ✅ | ✅ |
| Manage Users | ✅ | ❌ | ❌ |
| Manage Roles | ✅ | ❌ | ❌ |
| Assign User Roles | ✅ | ❌ | ❌ |
| Access Admin Panel | ✅ | ❌ | ❌ |

---

## 📁 Project Structure

```
doughvault/
├── app/                      # Next.js app directory
│   ├── admin/               # Administration panel
│   ├── api/                 # API routes
│   │   ├── items/          # Inventory endpoints
│   │   ├── users/          # User management
│   │   ├── roles/          # Role management
│   │   └── user-roles/     # Assignment management
│   ├── components/          # React components
│   │   ├── admin/          # Admin panel components
│   │   ├── stock/          # Stock management components
│   │   └── sidebar/        # Navigation components
│   ├── dashboard/          # Dashboard page
│   ├── stock/              # Inventory management page
│   └── providers/          # Context providers
├── lib/                     # Utilities and helpers
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.ts     # Authentication & roles
│   │   └── useQueries.ts  # React Query hooks
│   └── models/             # TypeScript types
├── models/                  # Database files
│   ├── schema.sql          # Database schema
│   ├── seeder.sql          # Sample data
│   └── init.sql            # Database initialization
├── public/                  # Static assets
└── middleware.ts           # Route protection
```

---

## 🔒 Security Features

- ✅ Clerk-based authentication
- ✅ Protected API routes
- ✅ Role-based UI element visibility
- ✅ Middleware route protection
- ✅ Audit logging for all changes
- ✅ SQL injection prevention via parameterized queries

---

## 📝 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Detailed setup guide
- **[AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md)** - Clerk configuration
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Feature overview
- **[TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)** - Comprehensive testing guide

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🆘 Troubleshooting

### "User not found" after login
- Ensure you created the Clerk account with the exact email
- Verify the database was seeded properly
- Check that Clerk User IDs match in the database

### Cannot access protected routes
- Verify `.env.local` has correct Clerk keys
- Ensure you're signed in through Clerk
- Check browser console for errors

### Database connection errors
- Verify PostgreSQL is running
- Check database credentials in `.env.local`
- Ensure database `doughvault` exists

For more detailed troubleshooting, see [QUICK_START.md](./QUICK_START.md).

---

**Built with ❤️ for pizza shops everywhere** 🍕
