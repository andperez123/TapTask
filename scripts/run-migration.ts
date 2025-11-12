import 'dotenv/config';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  const migrationFile = path.join(__dirname, '../drizzle/migrations/0002_add_password_field.sql');
  const sql = fs.readFileSync(migrationFile, 'utf-8');
  
  console.log('🔄 Running database migration...');
  console.log('Connecting to database...');
  
  // Get database URL from environment
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable not set!');
    process.exit(1);
  }
  
  try {
    // Create MySQL connection
    const connection = await mysql.createConnection(databaseUrl);
    console.log('✅ Connected to database');
    
    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements`);
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.toLowerCase().includes('create index')) {
        // Handle CREATE INDEX separately
        try {
          await connection.execute(statement);
          console.log(`✅ Executed: ${statement.substring(0, 60)}...`);
        } catch (error: any) {
          if (error.code === 'ER_DUP_KEYNAME') {
            console.log(`⚠️  Skipped (index already exists): ${statement.substring(0, 60)}...`);
          } else {
            console.error(`❌ Error executing: ${statement.substring(0, 60)}...`);
            console.error(error.message);
            throw error;
          }
        }
      } else {
        // Handle ALTER TABLE statements
        try {
          await connection.execute(statement);
          console.log(`✅ Executed: ${statement.substring(0, 60)}...`);
        } catch (error: any) {
          if (error.code === 'ER_DUP_FIELDNAME') {
            console.log(`⚠️  Skipped (column already exists): ${statement.substring(0, 60)}...`);
          } else if (error.code === 'ER_DUP_KEYNAME') {
            console.log(`⚠️  Skipped (index already exists): ${statement.substring(0, 60)}...`);
          } else {
            console.error(`❌ Error executing: ${statement.substring(0, 60)}...`);
            console.error(error.message);
            throw error;
          }
        }
      }
    }
    
    console.log('✅ Migration completed successfully!');
    
    // Close connection
    await connection.end();
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    if (error.code) {
      console.error(`Error code: ${error.code}`);
    }
    process.exit(1);
  }
}

runMigration()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
