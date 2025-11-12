import 'dotenv/config';
import { db } from '../server/src/db';
import { users } from '../server/src/schema';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@taptask.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const name = process.env.ADMIN_NAME || 'Admin User';

  console.log('🔐 Creating admin user...');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);

  try {
    // Check if admin already exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingAdmin[0]) {
      console.log('⚠️  Admin user already exists. Updating password...');
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Update password and ensure admin role
      await db
        .update(users)
        .set({
          password: hashedPassword,
          role: 'admin',
          name: name,
        })
        .where(eq(users.id, existingAdmin[0].id));
      
      console.log('✅ Admin user updated successfully!');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique openId (64 chars for hex string)
    const openId = crypto.randomBytes(32).toString('hex');

    // Create admin user
    const result = await db.insert(users).values({
      openId,
      email,
      password: hashedPassword,
      name,
      role: 'admin',
      loginMethod: 'email',
    });

    console.log('✅ Admin user created successfully!');
    console.log(`User ID: ${result[0].insertId}`);
    console.log('\n📝 Login credentials:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('\n⚠️  Please change the password after first login!');
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
