INSERT INTO Users (ClerkUserID, Email, FirstName, LastName, CreatedBy) VALUES 
('user_33avO7NuhzT7D54KSgT4wU0dlzf', 'system@doughvault.com', 'System', 'Admin', NULL);

UPDATE Users SET CreatedBy = UserID WHERE ClerkUserID = 'user_33avO7NuhzT7D54KSgT4wU0dlzf';

-- Roles (now we can reference UserID = 1)
INSERT INTO Roles (RoleName, RoleDescription, CreatedBy) VALUES 
('Admin', 'Full system access with all permissions', 1),
('Manager', 'Manage inventory, users, and view reports', 1),
('Staff', 'Basic inventory operations - view, add, update quantities', 1),
('Viewer', 'Read-only access to inventory and reports', 1);

-- Categories

INSERT INTO Categories (CategoryName, CategoryDescription, CreatedBy) VALUES 
('Flour & Grains', 'Different types of flour and grain products', 1),
('Dairy Products', 'Cheese, milk, cream, and other dairy items', 1),
('Meats & Proteins', 'Pepperoni, sausage, chicken, beef, and other proteins', 1),
('Vegetables', 'Fresh vegetables and toppings', 1),
('Sauces & Condiments', 'Pizza sauces, olive oil, seasonings', 1),
('Beverages', 'Soft drinks, water, juices', 1),
('Packaging', 'Pizza boxes, napkins, cups, bags', 1),
('Cleaning Supplies', 'Sanitizers, detergents, cleaning equipment', 1),
('Equipment Parts', 'Oven parts, kitchen utensils, maintenance supplies', 1);

-- Items
INSERT INTO Items (ItemName, ItemDescription, CategoryID, SKU, Unit, Quantity, ReorderThreshold, CostPrice, SupplierInfo, StorageLocation, CreatedBy) VALUES 
('00 Flour (Tipo 00)', 'Fine Italian flour perfect for pizza dough', 1, 'FLOUR-00-25KG', 'kg', 150.00, 25.00, 2.50, 'Caputo Flour Co. - Order #CF2024', 'Dry Storage Room A', 1),
('Bread Flour (High Gluten)', 'High protein flour for chewy pizza crusts', 1, 'FLOUR-BREAD-25KG', 'kg', 100.00, 20.00, 2.20, 'King Arthur Flour - Order #KA2024', 'Dry Storage Room A', 1),
('Semolina Flour', 'Coarse flour for dusting pizza peels', 1, 'FLOUR-SEM-10KG', 'kg', 25.00, 5.00, 3.00, 'Bob''s Red Mill - Order #BR2024', 'Dry Storage Room A', 1),


('Mozzarella Cheese (Low Moisture)', 'Premium pizza mozzarella', 2, 'CHEESE-MOZ-5LB', 'lbs', 80.00, 15.00, 4.50, 'Grande Cheese Co. - Order #GC2024', 'Walk-in Cooler', 1),
('Parmesan Cheese (Grated)', 'Aged parmesan for finishing pizzas', 2, 'CHEESE-PARM-2LB', 'lbs', 20.00, 5.00, 8.00, 'BelGioioso Cheese - Order #BG2024', 'Walk-in Cooler', 1),
('Ricotta Cheese', 'Fresh ricotta for white pizzas', 2, 'CHEESE-RIC-3LB', 'lbs', 15.00, 3.00, 5.50, 'Calabro Cheese - Order #CC2024', 'Walk-in Cooler', 1),
('Fresh Mozzarella', 'Buffalo mozzarella for gourmet pizzas', 2, 'CHEESE-FRESH-MOZ', 'lbs', 10.00, 2.00, 7.00, 'Caseificio Andriese - Order #CA2024', 'Walk-in Cooler', 1),


('Pepperoni (Sliced)', 'Classic pepperoni slices', 3, 'MEAT-PEP-5LB', 'lbs', 50.00, 10.00, 6.50, 'Hormel Foods - Order #HF2024', 'Walk-in Cooler', 1),
('Italian Sausage (Crumbled)', 'Spicy Italian sausage', 3, 'MEAT-SAUS-5LB', 'lbs', 30.00, 8.00, 5.75, 'Johnsonville - Order #JV2024', 'Freezer', 1),
('Prosciutto', 'Thin sliced prosciutto di Parma', 3, 'MEAT-PROS-2LB', 'lbs', 8.00, 2.00, 15.00, 'Volpi Foods - Order #VF2024', 'Walk-in Cooler', 1),
('Chicken Breast (Grilled)', 'Pre-grilled chicken strips', 3, 'MEAT-CHICK-3LB', 'lbs', 25.00, 5.00, 7.25, 'Tyson Foods - Order #TF2024', 'Freezer', 1),


('San Marzano Tomatoes (Whole)', 'Premium canned tomatoes for sauce', 4, 'VEG-TOM-SM-28OZ', 'cans', 48.00, 12.00, 4.50, 'Cento Fine Foods - Order #CF2024', 'Dry Storage Room B', 1),
('Fresh Basil', 'Fresh basil leaves', 4, 'VEG-BASIL-1LB', 'lbs', 3.00, 1.00, 12.00, 'Local Organic Farm - Order #LOF2024', 'Walk-in Cooler', 1),
('Red Onions', 'Fresh red onions for toppings', 4, 'VEG-ONION-RED', 'lbs', 20.00, 5.00, 1.50, 'Sysco Foods - Order #SF2024', 'Dry Storage Room B', 1),
('Bell Peppers (Mixed)', 'Red, yellow, green bell peppers', 4, 'VEG-PEPPER-MIX', 'lbs', 15.00, 4.00, 2.25, 'Sysco Foods - Order #SF2024', 'Walk-in Cooler', 1),
('Mushrooms (Sliced)', 'Pre-sliced button mushrooms', 4, 'VEG-MUSH-2LB', 'lbs', 12.00, 3.00, 3.50, 'Giorgio Fresh Co. - Order #GFC2024', 'Walk-in Cooler', 1),
('Arugula', 'Fresh arugula for gourmet pizzas', 4, 'VEG-ARUG-1LB', 'lbs', 5.00, 2.00, 8.00, 'Local Organic Farm - Order #LOF2024', 'Walk-in Cooler', 1),


('Pizza Sauce (Traditional)', 'House-made traditional pizza sauce', 5, 'SAUCE-TRAD-QT', 'quarts', 24.00, 6.00, 3.25, 'In-house made', 'Walk-in Cooler', 1),
('White Sauce (Garlic)', 'Creamy garlic white sauce', 5, 'SAUCE-WHITE-QT', 'quarts', 12.00, 3.00, 4.00, 'In-house made', 'Walk-in Cooler', 1),
('Extra Virgin Olive Oil', 'Premium EVOO for drizzling', 5, 'OIL-EVOO-1L', 'liters', 8.00, 2.00, 12.00, 'Colavita - Order #CV2024', 'Dry Storage Room A', 1),
('Balsamic Glaze', 'Aged balsamic reduction', 5, 'SAUCE-BALS-500ML', 'bottles', 6.00, 2.00, 8.50, 'Modena Imports - Order #MI2024', 'Dry Storage Room A', 1),
('Hot Honey', 'Spicy honey for finishing pizzas', 5, 'SAUCE-HOT-HON', 'bottles', 10.00, 3.00, 6.00, 'Mike''s Hot Honey - Order #MHH2024', 'Dry Storage Room A', 1),


('Coca-Cola (Cans)', '12oz cans of Coca-Cola', 6, 'BEV-COKE-12OZ', 'cans', 144.00, 48.00, 0.75, 'Coca-Cola Co. - Order #CC2024', 'Beverage Cooler', 1),
('Pepsi (Cans)', '12oz cans of Pepsi', 6, 'BEV-PEPSI-12OZ', 'cans', 144.00, 48.00, 0.75, 'PepsiCo - Order #PC2024', 'Beverage Cooler', 1),
('Bottled Water', '16.9oz bottled water', 6, 'BEV-WATER-16OZ', 'bottles', 96.00, 24.00, 0.50, 'Dasani - Order #DS2024', 'Beverage Cooler', 1),
('Orange Juice', 'Fresh orange juice', 6, 'BEV-OJ-1L', 'liters', 12.00, 4.00, 3.50, 'Tropicana - Order #TP2024', 'Walk-in Cooler', 1),


('Pizza Boxes (16 inch)', 'Large pizza boxes', 7, 'PKG-BOX-16IN', 'pieces', 500.00, 100.00, 0.85, 'WestRock Packaging - Order #WR2024', 'Storage Room C', 1),
('Pizza Boxes (12 inch)', 'Medium pizza boxes', 7, 'PKG-BOX-12IN', 'pieces', 300.00, 75.00, 0.65, 'WestRock Packaging - Order #WR2024', 'Storage Room C', 1),
('Paper Napkins', 'White paper napkins', 7, 'PKG-NAP-1000', 'pieces', 2000.00, 500.00, 0.02, 'Georgia-Pacific - Order #GP2024', 'Storage Room C', 1),
('Plastic Cups (16oz)', 'Clear plastic cups', 7, 'PKG-CUP-16OZ', 'pieces', 1000.00, 200.00, 0.15, 'Solo Cup Co. - Order #SC2024', 'Storage Room C', 1),


('All-Purpose Sanitizer', 'Food-safe surface sanitizer', 8, 'CLEAN-SANIT-1L', 'liters', 12.00, 3.00, 8.50, 'Ecolab - Order #EC2024', 'Cleaning Storage', 1),
('Dish Detergent', 'Commercial dish soap', 8, 'CLEAN-DISH-5L', 'liters', 8.00, 2.00, 15.00, 'Dawn Professional - Order #DP2024', 'Cleaning Storage', 1),
('Paper Towels (Industrial)', 'Heavy-duty paper towels', 8, 'CLEAN-TOWEL-12RL', 'rolls', 24.00, 6.00, 2.25, 'Bounty Commercial - Order #BC2024', 'Cleaning Storage', 1),


('Pizza Peel (Wood)', 'Wooden pizza peel for oven', 9, 'EQUIP-PEEL-WOOD', 'pieces', 6.00, 2.00, 25.00, 'Baker''s Mark - Order #BM2024', 'Equipment Storage', 1),
('Dough Scraper', 'Metal dough bench scraper', 9, 'EQUIP-SCRAP-MET', 'pieces', 10.00, 3.00, 8.50, 'Winco - Order #WC2024', 'Equipment Storage', 1),
('Pizza Cutter Wheels', 'Replacement wheels for pizza cutters', 9, 'EQUIP-CUT-WHEEL', 'pieces', 20.00, 5.00, 3.00, 'Dexter Russell - Order #DR2024', 'Equipment Storage', 1);

-- Additional Users (system user already created above)
INSERT INTO Users (ClerkUserID, Email, FirstName, LastName, CreatedBy) VALUES 
('user_33avFj8gTtIJSg8rzXlsbTIuysL', 'mario@pizzashop.com', 'Mario', 'Rossi', 1),
('user_33avZNyyN0PVJbpTnRUpAIbE7x1', 'luigi@pizzashop.com', 'Luigi', 'Verde', 1),
('user_33avUVgn10m02ACYprV8obZWSu3', 'anna@pizzashop.com', 'Anna', 'Bianchi', 1);

INSERT INTO UserRoles (UserID, RoleID, AssignedBy) VALUES 
(1, 1, 1),
(2, 2, 1),
(3, 3, 1),
(4, 3, 1);

-- Views
CREATE VIEW LowStockItems AS
SELECT 
    i.ItemID,
    i.ItemUUID,
    i.ItemName,
    i.SKU,
    i.Quantity,
    i.ReorderThreshold,
    i.Unit,
    c.CategoryName,
    i.CostPrice,
    (i.Quantity - i.ReorderThreshold) AS StockDifference
FROM Items i
JOIN Categories c ON i.CategoryID = c.CategoryID
WHERE i.Quantity <= i.ReorderThreshold 
  AND i.IsActive = TRUE;


CREATE VIEW InventoryValue AS
SELECT 
    c.CategoryName,
    COUNT(i.ItemID) as ItemCount,
    SUM(i.Quantity * i.CostPrice) AS TotalValue,
    AVG(i.CostPrice) AS AvgCostPrice
FROM Items i
JOIN Categories c ON i.CategoryID = c.CategoryID
WHERE i.IsActive = TRUE
GROUP BY c.CategoryID, c.CategoryName
ORDER BY TotalValue DESC;


CREATE VIEW RecentInventoryChanges AS
SELECT 
    il.LogID,
    il.ItemID,
    i.ItemName,
    il.Action,
    il.QuantityChanged,
    il.ReasonCode,
    il.Notes,
    u.FirstName || ' ' || u.LastName AS ChangedByUser,
    il.ChangedOn
FROM ItemsLogs il
JOIN Items i ON il.ItemID = i.ItemID
LEFT JOIN Users u ON il.ChangedBy = u.UserID
ORDER BY il.ChangedOn DESC
LIMIT 100;

CREATE VIEW ItemsByCategory AS
SELECT 
    c.CategoryID,
    c.CategoryName,
    COUNT(i.ItemID) as TotalItems,
    COUNT(CASE WHEN i.IsActive = TRUE THEN 1 END) as ActiveItems,
    COUNT(CASE WHEN i.Quantity <= i.ReorderThreshold AND i.IsActive = TRUE THEN 1 END) as LowStockCount,
    ROUND(AVG(i.CostPrice), 2) as AvgCostPrice,
    SUM(CASE WHEN i.IsActive = TRUE THEN i.Quantity * i.CostPrice ELSE 0 END) as CategoryValue
FROM Categories c
LEFT JOIN Items i ON c.CategoryID = i.CategoryID
GROUP BY c.CategoryID, c.CategoryName
ORDER BY CategoryValue DESC;

CREATE VIEW UserActivity AS
SELECT 
    u.UserID,
    u.FirstName || ' ' || u.LastName as UserName,
    u.Email,
    r.RoleName,
    COUNT(il.LogID) as TotalActions,
    COUNT(CASE WHEN il.Action = 'INSERT' THEN 1 END) as ItemsAdded,
    COUNT(CASE WHEN il.Action = 'UPDATE' THEN 1 END) as ItemsUpdated,
    COUNT(CASE WHEN il.Action = 'DELETE' THEN 1 END) as ItemsDeleted,
    MAX(il.ChangedOn) as LastActivity
FROM Users u
LEFT JOIN UserRoles ur ON u.UserID = ur.UserID AND ur.IsActive = TRUE
LEFT JOIN Roles r ON ur.RoleID = r.RoleID
LEFT JOIN ItemsLogs il ON u.UserID = il.ChangedBy
WHERE u.IsActive = TRUE
GROUP BY u.UserID, u.FirstName, u.LastName, u.Email, r.RoleName
ORDER BY TotalActions DESC;

CREATE VIEW ExpiryAlert AS
SELECT 
    i.ItemID,
    i.ItemUUID,
    i.ItemName,
    i.SKU,
    i.ExpiryDate,
    i.Quantity,
    i.Unit,
    c.CategoryName,
    CASE 
        WHEN i.ExpiryDate <= CURRENT_DATE THEN 'EXPIRED'
        WHEN i.ExpiryDate <= CURRENT_DATE + INTERVAL '7 days' THEN 'EXPIRES SOON'
        WHEN i.ExpiryDate <= CURRENT_DATE + INTERVAL '30 days' THEN 'EXPIRES THIS MONTH'
        ELSE 'OK'
    END as ExpiryStatus,
    (i.ExpiryDate - CURRENT_DATE) as DaysUntilExpiry
FROM Items i
JOIN Categories c ON i.CategoryID = c.CategoryID
WHERE i.IsActive = TRUE 
  AND i.ExpiryDate IS NOT NULL 
  AND i.ExpiryDate <= CURRENT_DATE + INTERVAL '30 days'
ORDER BY i.ExpiryDate ASC;

CREATE VIEW StockMovements AS
SELECT 
    i.ItemID,
    i.ItemName,
    i.SKU,
    c.CategoryName,
    il.QuantityChanged,
    il.ReasonCode,
    il.Action,
    il.ChangedOn,
    u.FirstName || ' ' || u.LastName as User,
    LAG(il.OldValues->>'Quantity') OVER (PARTITION BY i.ItemID ORDER BY il.ChangedOn) as PreviousQty,
    il.NewValues->>'Quantity' as CurrentQty
FROM ItemsLogs il
JOIN Items i ON il.ItemID = i.ItemID
JOIN Categories c ON i.CategoryID = c.CategoryID
LEFT JOIN Users u ON il.ChangedBy = u.UserID
WHERE il.QuantityChanged IS NOT NULL
ORDER BY il.ChangedOn DESC;

CREATE VIEW SupplierSummary AS
SELECT 
    TRIM(SPLIT_PART(i.SupplierInfo, '-', 1)) as SupplierName,
    COUNT(i.ItemID) as ItemCount,
    SUM(i.Quantity * i.CostPrice) as TotalValue,
    COUNT(CASE WHEN i.Quantity <= i.ReorderThreshold THEN 1 END) as LowStockItems,
    AVG(i.CostPrice) as AvgCostPrice,
    STRING_AGG(DISTINCT c.CategoryName, ', ') as Categories
FROM Items i
JOIN Categories c ON i.CategoryID = c.CategoryID
WHERE i.IsActive = TRUE AND i.SupplierInfo IS NOT NULL
GROUP BY TRIM(SPLIT_PART(i.SupplierInfo, '-', 1))
HAVING COUNT(i.ItemID) > 0
ORDER BY TotalValue DESC;

-- Functions
CREATE OR REPLACE FUNCTION get_total_inventory_value()
RETURNS DECIMAL(12,2) AS $$
BEGIN
    RETURN (
        SELECT COALESCE(SUM(Quantity * CostPrice), 0)
        FROM Items 
        WHERE IsActive = TRUE
    );
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION needs_reorder(item_id INT)
RETURNS BOOLEAN AS $$
DECLARE
    current_qty DECIMAL(10,2);
    threshold DECIMAL(10,2);
BEGIN
    SELECT Quantity, ReorderThreshold 
    INTO current_qty, threshold
    FROM Items 
    WHERE ItemID = item_id AND IsActive = TRUE;
    
    RETURN current_qty <= threshold;
END;
$$ LANGUAGE plpgsql;
