import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from server directory
dotenv.config({ path: path.join(__dirname, 'server', '.env') });

export default {
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/taptask',
  },
};
