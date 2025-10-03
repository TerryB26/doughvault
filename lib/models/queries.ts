import { query } from '../database';
import { 
  User, 
  Role, 
  UserRole, 
  Item, 
  Category, 
  LowStockItem, 
  InventoryValue,
  UserActivity 
} from './types';

// User queries
export async function getUsers(): Promise<User[]> {
  const result = await query(`
    SELECT 
      u.userid,
      u.useruuid,
      u.clerkuserid,
      u.email,
      u.firstname,
      u.lastname,
      u.isactive,
      u.createdby,
      u.createdon,
      u.updatedby,
      u.updatedon
    FROM users u
    WHERE u.isactive = true
    ORDER BY u.createdon DESC
  `);
  return result.rows;
}

export async function getUserById(id: number): Promise<User | null> {
  const result = await query(`
    SELECT 
      u.userid,
      u.useruuid,
      u.clerkuserid,
      u.email,
      u.firstname,
      u.lastname,
      u.isactive,
      u.createdby,
      u.createdon,
      u.updatedby,
      u.updatedon
    FROM users u
    WHERE u.userid = $1
  `, [id]);
  return result.rows[0] || null;
}

// Role queries
export async function getRoles(): Promise<Role[]> {
  const result = await query(`
    SELECT 
      r.roleid,
      r.roleuuid,
      r.rolename,
      r.roledescription,
      r.isactive,
      r.createdby,
      r.createdon,
      r.updatedby,
      r.updatedon
    FROM roles r
    ORDER BY r.rolename
  `);
  return result.rows;
}

export async function getRoleById(id: number): Promise<Role | null> {
  const result = await query(`
    SELECT 
      r.roleid,
      r.roleuuid,
      r.rolename,
      r.roledescription,
      r.isactive,
      r.createdby,
      r.createdon,
      r.updatedby,
      r.updatedon
    FROM roles r
    WHERE r.roleid = $1
  `, [id]);
  return result.rows[0] || null;
}

// User Role queries
export async function getUserRoles(): Promise<UserRole[]> {
  const result = await query(`
    SELECT 
      ur.userroleid,
      ur.userroleuuid,
      ur.userid,
      ur.roleid,
      ur.assignedon,
      ur.assignedby,
      ur.isactive
    FROM userroles ur
    WHERE ur.isactive = true
    ORDER BY ur.assignedon DESC
  `);
  return result.rows;
}

// Enhanced user roles with user and role details
export async function getUserRolesWithDetails() {
  const result = await query(`
    SELECT 
      ur.userroleid,
      ur.userid,
      u.firstname || ' ' || u.lastname as username,
      u.email as useremail,
      ur.roleid,
      r.rolename,
      ur.assignedon,
      COALESCE(assigned_by.firstname || ' ' || assigned_by.lastname, 'System') as assignedby,
      (ur.isactive AND r.isactive) as isactive
    FROM userroles ur
    JOIN users u ON ur.userid = u.userid
    JOIN roles r ON ur.roleid = r.roleid
    LEFT JOIN users assigned_by ON ur.assignedby = assigned_by.userid
    ORDER BY ur.assignedon DESC
  `);
  return result.rows;
}

// Enhanced users with role information
export async function getUsersWithRoles() {
  const result = await query(`
    SELECT 
      u.userid,
      u.useruuid,
      u.firstname || ' ' || u.lastname as name,
      u.email,
      COALESCE(r.rolename, 'No Role') as role,
      u.isactive,
      u.createdon as lastlogin
    FROM users u
    LEFT JOIN userroles ur ON u.userid = ur.userid AND ur.isactive = true
    LEFT JOIN roles r ON ur.roleid = r.roleid AND r.isactive = true
    WHERE u.isactive = true
    ORDER BY u.createdon DESC
  `);
  return result.rows;
}

// Category queries
export async function getCategories(): Promise<Category[]> {
  const result = await query(`
    SELECT 
      c.categoryid,
      c.categoryuuid,
      c.categoryname,
      c.categorydescription,
      c.isactive,
      c.createdby,
      c.createdon,
      c.updatedby,
      c.updatedon
    FROM categories c
    WHERE c.isactive = true
    ORDER BY c.categoryname
  `);
  return result.rows;
}

// Item queries
export async function getItems(): Promise<Item[]> {
  const result = await query(`
    SELECT 
      i.itemid,
      i.itemuuid,
      i.itemname,
      i.itemdescription,
      i.categoryid,
      i.sku,
      i.unit,
      i.quantity,
      i.reorderthreshold,
      i.costprice,
      i.supplierinfo,
      i.storagelocation,
      i.expirydate,
      i.isactive,
      i.createdby,
      i.createdon,
      i.updatedby,
      i.updatedon
    FROM items i
    WHERE i.isactive = true
    ORDER BY i.itemname
  `);
  return result.rows;
}

// Enhanced items with category information
export async function getItemsWithCategories() {
  const result = await query(`
    SELECT 
      i.itemid,
      i.itemname,
      c.categoryname,
      i.sku,
      i.quantity,
      i.unit,
      i.reorderthreshold,
      i.costprice,
      COALESCE(SPLIT_PART(i.supplierinfo, ' - ', 1), 'Unknown') as supplier,
      i.storagelocation,
      CASE 
        WHEN i.quantity = 0 THEN 'Out of Stock'
        WHEN i.quantity <= i.reorderthreshold THEN 'Low Stock'
        ELSE 'In Stock'
      END as status
    FROM items i
    LEFT JOIN categories c ON i.categoryid = c.categoryid
    WHERE i.isactive = true
    ORDER BY 
      CASE 
        WHEN i.quantity = 0 THEN 1
        WHEN i.quantity <= i.reorderthreshold THEN 2
        ELSE 3
      END,
      i.itemname
  `);
  return result.rows;
}

// View queries
export async function getLowStockItems(): Promise<LowStockItem[]> {
  const result = await query(`
    SELECT * FROM lowstockitems
    ORDER BY stockdifference ASC
  `);
  return result.rows;
}

export async function getInventoryValue(): Promise<InventoryValue[]> {
  const result = await query(`
    SELECT * FROM inventoryvalue
    ORDER BY totalvalue DESC
  `);
  return result.rows;
}

export async function getUserActivity(): Promise<UserActivity[]> {
  const result = await query(`
    SELECT * FROM useractivity
    ORDER BY totalactions DESC
  `);
  return result.rows;
}

// Summary functions
export async function getInventorySummary() {
  const result = await query(`
    SELECT 
      COUNT(*) as totalitems,
      COUNT(CASE WHEN quantity <= reorderthreshold THEN 1 END) as lowstockcount,
      COUNT(CASE WHEN quantity = 0 THEN 1 END) as outstockcount,
      COALESCE(SUM(quantity * costprice), 0) as totalvalue
    FROM items
    WHERE isactive = true
  `);
  return result.rows[0];
}

export async function getRolesWithUserCount() {
  const result = await query(`
    SELECT 
      r.roleid,
      r.rolename,
      r.roledescription,
      r.isactive,
      COUNT(ur.userid) as usercount,
      r.createdon
    FROM roles r
    LEFT JOIN userroles ur ON r.roleid = ur.roleid AND ur.isactive = true
    GROUP BY r.roleid, r.rolename, r.roledescription, r.isactive, r.createdon
    ORDER BY r.rolename
  `);
  return result.rows;
}
