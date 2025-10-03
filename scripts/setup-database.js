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

async function setupDatabase() {
  const client = new Client(config);
  
  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to PostgreSQL database');

    // Check if tables exist
    console.log('\n� Checking if database is already set up...');
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    const tablesExist = tableCheck.rows[0].exists;
    
    if (tablesExist) {
      console.log('⚠️  Database tables already exist. Skipping schema creation.');
      console.log('💡 To reset the database, run: npm run db:reset');
    } else {
      console.log('\n�📋 Creating database schema...');
      const schemaPath = path.join(__dirname, '..', 'models', 'schema.sql');
      const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
      await client.query(schemaSQL);
      console.log('✅ Schema created successfully!');
      
      console.log('\n🌱 Seeding database with initial data...');
      const seederPath = path.join(__dirname, '..', 'models', 'seeder.sql');
      const seederSQL = fs.readFileSync(seederPath, 'utf8');
      await client.query(seederSQL);
      console.log('✅ Seed data inserted successfully!');
    }



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

    console.log('\n⚠️  Low stock items (if any):');
    const lowStockResult = await client.query('SELECT * FROM LowStockItems');
    if (lowStockResult.rows.length > 0) {
      console.table(lowStockResult.rows);
    } else {
      console.log('No low stock items found.');
    }

    console.log('\n💰 Total inventory value:');
    const valueResult = await client.query('SELECT get_total_inventory_value() as TotalInventoryValue');
    console.log(`$${parseFloat(valueResult.rows[0].totalinventoryvalue).toFixed(2)}`);

    console.log('\n🍕 Setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    if (error.code) {
      console.error('Error Code:', error.code);
    }
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

setupDatabase();
