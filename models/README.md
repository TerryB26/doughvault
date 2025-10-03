# DoughVault Database Models

This directory contains the complete database schema and seeder for the DoughVault pizza shop inventory management system.

## Files Overview

- **`schema.sql`** - Complete database schema with tables, indexes, triggers, and audit logging
- **`seeder.sql`** - Comprehensive seed data with realistic pizza shop inventory items
- **`init.sql`** - Initialization script that runs both schema and seeder files

## Database Features

### 🏗️ **Core Tables**
- **Users** - User accounts with Clerk integration
- **Roles** - Role-based access control (Admin, Manager, Staff, Viewer)
- **UserRoles** - Many-to-many relationship between users and roles
- **Categories** - Inventory item categories (Flour, Dairy, Meats, etc.)
- **Items** - Main inventory items with full tracking capabilities

### 📊 **Audit System**
- **Comprehensive Logging** - Every table has a corresponding log table
- **Automatic Triggers** - Changes are logged automatically with timestamps and user info
- **Quantity Tracking** - Special logging for inventory quantity changes with reason codes
- **JSONB Storage** - Old and new values stored as JSON for complete audit trail

### 🔒 **Security Features**
- **Dual ID System** - Both integer IDs and UUIDs for enhanced security
- **Soft Deletes** - IsActive flags instead of hard deletes
- **User Tracking** - CreatedBy/UpdatedBy fields on all records
- **Timestamp Tracking** - Automatic CreatedOn/UpdatedOn timestamps

### 📈 **Business Logic**
- **Reorder Thresholds** - Automatic low stock detection
- **Cost Tracking** - Track cost price for inventory valuation
- **Supplier Information** - Maintain supplier details for reordering
- **Storage Locations** - Track where items are stored
- **Expiry Dates** - Monitor perishable items

## Seed Data Includes

### 🧑‍🍳 **Pizza Shop Categories**
- Flour & Grains (Tipo 00, Bread Flour, Semolina)
- Dairy Products (Mozzarella, Parmesan, Ricotta, Fresh Mozzarella)
- Meats & Proteins (Pepperoni, Italian Sausage, Prosciutto, Chicken)
- Vegetables (San Marzano Tomatoes, Fresh Basil, Peppers, Mushrooms)
- Sauces & Condiments (Pizza Sauce, White Sauce, EVOO, Balsamic)
- Beverages (Sodas, Water, Juices)
- Packaging (Pizza Boxes, Napkins, Cups)
- Cleaning Supplies (Sanitizers, Detergents)
- Equipment Parts (Pizza Peels, Scrapers, Cutter Wheels)

### 👥 **User Roles**
- **Admin** - Full system access
- **Manager** - Inventory management and user oversight
- **Staff** - Basic inventory operations
- **Viewer** - Read-only access

## Useful Views

### 📉 **LowStockItems**
```sql
SELECT * FROM LowStockItems;
```
Shows items that need reordering (quantity <= threshold)

### 💰 **InventoryValue** 
```sql
SELECT * FROM InventoryValue;
```
Shows total value by category

### 📝 **RecentInventoryChanges**
```sql
SELECT * FROM RecentInventoryChanges;
```
Shows the last 100 inventory changes with user information

## Utility Functions

### 💵 **get_total_inventory_value()**
```sql
SELECT get_total_inventory_value();
```
Returns the total value of all active inventory

### ⚠️ **needs_reorder(item_id)**
```sql
SELECT needs_reorder(123);
```
Checks if a specific item needs reordering

## Setup Instructions

### 1. **PostgreSQL Setup**
```bash
# Install PostgreSQL (if not installed)
# Create database
createdb doughvault
```

### 2. **Run Initialization**
```bash
# Connect to PostgreSQL and run:
psql -d doughvault -f models/init.sql
```

### 3. **Alternative Step-by-Step**
```bash
# Run schema only
psql -d doughvault -f models/schema.sql

# Run seeder only  
psql -d doughvault -f models/seeder.sql
```

## Integration with Next.js

This schema is designed to work seamlessly with:
- **Clerk Authentication** (ClerkUserID field in Users table)
- **Prisma ORM** (can generate Prisma schema from this SQL)
- **Next.js API Routes** (RESTful endpoints for inventory operations)
- **React Components** (data structure optimized for frontend consumption)

## Sample Queries

### Check Current Stock Levels
```sql
SELECT 
    ItemName, 
    Quantity, 
    Unit, 
    ReorderThreshold,
    CASE 
        WHEN Quantity <= ReorderThreshold THEN 'REORDER NEEDED'
        ELSE 'OK'
    END as Status
FROM Items 
WHERE IsActive = TRUE
ORDER BY Quantity ASC;
```

### Inventory Change History
```sql
SELECT 
    i.ItemName,
    il.Action,
    il.QuantityChanged,
    il.ReasonCode,
    u.FirstName || ' ' || u.LastName as User,
    il.ChangedOn
FROM ItemsLogs il
JOIN Items i ON il.ItemID = i.ItemID
LEFT JOIN Users u ON il.ChangedBy = u.UserID
WHERE il.ChangedOn >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY il.ChangedOn DESC;
```

### Category Performance
```sql
SELECT 
    c.CategoryName,
    COUNT(i.ItemID) as ItemCount,
    SUM(i.Quantity * i.CostPrice) as TotalValue,
    COUNT(CASE WHEN i.Quantity <= i.ReorderThreshold THEN 1 END) as LowStockItems
FROM Categories c
LEFT JOIN Items i ON c.CategoryID = i.CategoryID AND i.IsActive = TRUE
GROUP BY c.CategoryID, c.CategoryName
ORDER BY TotalValue DESC;
```

---

**Ready to power your pizza shop! 🍕**
