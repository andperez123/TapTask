import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2';
import * as schema from '../../drizzle/schema';

// Create connection pool with proper config
const connection = mysql.createPool({
  uri: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/taptask',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const db = drizzle(connection, { schema, mode: 'default' });
