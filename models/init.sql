\echo 'Starting DoughVault database setup...'
\i schema.sql

\echo 'Schema created successfully!'


\i seeder.sql

\echo 'Seed data inserted successfully!'


\echo 'Database setup complete! Summary:'

SELECT 'Categories' as TableName, COUNT(*) as RecordCount FROM Categories
UNION ALL
SELECT 'Items' as TableName, COUNT(*) as RecordCount FROM Items  
UNION ALL
SELECT 'Users' as TableName, COUNT(*) as RecordCount FROM Users
UNION ALL
SELECT 'Roles' as TableName, COUNT(*) as RecordCount FROM Roles
UNION ALL  
SELECT 'UserRoles' as TableName, COUNT(*) as RecordCount FROM UserRoles
ORDER BY TableName;

\echo 'Low stock items (if any):'
SELECT * FROM LowStockItems;

\echo 'Total inventory value:'
SELECT get_total_inventory_value() as TotalInventoryValue;

\echo 'Setup completed successfully! 🍕'
