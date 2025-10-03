#!/usr/bin/env node

import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config as dotenvConfig } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenvConfig({ path: path.join(__dirname, '..', '.env.database') });

const config = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true'
};

async function resetDatabase() {
  const client = new Client(config);
  
  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to PostgreSQL database');

    console.log('\n🗑️  Dropping existing tables...');
    
    // Drop tables in correct order (reverse of creation due to foreign keys)
    const dropQueries = [
      'DROP TABLE IF EXISTS ItemsLogs CASCADE;',
      'DROP TABLE IF EXISTS CategoriesLogs CASCADE;',
      'DROP TABLE IF EXISTS UserRolesLogs CASCADE;',
      'DROP TABLE IF EXISTS RolesLogs CASCADE;',
      'DROP TABLE IF EXISTS UsersLogs CASCADE;',
      'DROP TABLE IF EXISTS Items CASCADE;',
      'DROP TABLE IF EXISTS Categories CASCADE;',
      'DROP TABLE IF EXISTS UserRoles CASCADE;',
      'DROP TABLE IF EXISTS Roles CASCADE;',
      'DROP TABLE IF EXISTS Users CASCADE;'
    ];
    
    for (const query of dropQueries) {
      await client.query(query);
    }
    
    // Drop views
    console.log('🗑️  Dropping views...');
    const viewDropQueries = [
      'DROP VIEW IF EXISTS LowStockItems CASCADE;',
      'DROP VIEW IF EXISTS InventoryValue CASCADE;',
      'DROP VIEW IF EXISTS RecentInventoryChanges CASCADE;',
      'DROP VIEW IF EXISTS ItemsByCategory CASCADE;',
      'DROP VIEW IF EXISTS UserActivity CASCADE;',
      'DROP VIEW IF EXISTS ExpiryAlert CASCADE;',
      'DROP VIEW IF EXISTS StockMovements CASCADE;',
      'DROP VIEW IF EXISTS SupplierSummary CASCADE;'
    ];
    
    for (const query of viewDropQueries) {
      await client.query(query);
    }
    
    // Drop functions
    console.log('🗑️  Dropping functions...');
    await client.query('DROP FUNCTION IF EXISTS get_total_inventory_value() CASCADE;');
    await client.query('DROP FUNCTION IF EXISTS needs_reorder(INT) CASCADE;');
    await client.query('DROP FUNCTION IF EXISTS audit_trigger_function() CASCADE;');
    await client.query('DROP FUNCTION IF EXISTS items_audit_trigger_function() CASCADE;');
    await client.query('DROP FUNCTION IF EXISTS update_updated_on_column() CASCADE;');
    
    console.log('✅ Database reset complete!');
    
    // Now create schema and seed data
    console.log('\n📋 Creating database schema...');
    const schemaPath = path.join(__dirname, '..', 'models', 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSQL);
    console.log('✅ Schema created successfully!');

    console.log('\n🌱 Seeding database with initial data...');
    
    // Temporarily disable triggers during seeding
    console.log('🔇 Temporarily disabling audit triggers for seeding...');
    await client.query('SET session_replication_role = replica;');
    
    const seederPath = path.join(__dirname, '..', 'models', 'seeder.sql');
    const seederSQL = fs.readFileSync(seederPath, 'utf8');
    await client.query(seederSQL);
    
    // Re-enable triggers
    await client.query('SET session_replication_role = DEFAULT;');
    console.log('🔊 Re-enabled audit triggers');
    console.log('✅ Seed data inserted successfully!');

    // Get summary statistics
    console.log('\n📊 Database setup complete! Summary:');
    
    const summaryQuery = `
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
    `;
    
    const summaryResult = await client.query(summaryQuery);
    console.table(summaryResult.rows);

    // Check for low stock items
    console.log('\n⚠️  Low stock items (if any):');
    const lowStockResult = await client.query('SELECT * FROM LowStockItems');
    if (lowStockResult.rows.length > 0) {
      console.table(lowStockResult.rows);
    } else {
      console.log('No low stock items found.');
    }

    // Get total inventory value
    console.log('\n💰 Total inventory value:');
    const valueResult = await client.query('SELECT get_total_inventory_value() as TotalInventoryValue');
    console.log(`$${parseFloat(valueResult.rows[0].totalinventoryvalue).toFixed(2)}`);

    console.log('\n🍕 Database reset and setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error.message);
    if (error.code) {
      console.error('Error Code:', error.code);
    }
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

// Run the reset
resetDatabase();
