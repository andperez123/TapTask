import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
  schema: '../drizzle/schema.ts',
  out: '../drizzle/migrations',
  driver: 'mysql2',
  dbCredentials: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'taptask',
  },
} satisfies Config;


