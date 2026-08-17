/**
 * Database Initialization Script
 * Run this to initialize the MySQL database with schema.sql
 * 
 * Usage: node scripts/init-db.mjs
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'birthday_saas',
  multipleStatements: true,
});

async function initDatabase() {
  try {
    console.log('Reading schema.sql...');
    const schemaPath = path.join(process.cwd(), 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Executing schema...');
    await pool.query(schema);
    
    console.log('✅ Database initialized successfully!');
    await pool.end();
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    await pool.end();
    process.exit(1);
  }
}

initDatabase();
