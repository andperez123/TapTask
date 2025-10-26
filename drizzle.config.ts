import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from server directory
dotenv.config({ path: path.join(__dirname, 'server', '.env') });

export default {
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'mysql',
  dbCredentials: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    database: 'taptask',
  },
} satisfies Config;
