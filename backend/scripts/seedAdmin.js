import bcrypt from 'bcryptjs';
import { initDB } from '../db/init.js';
import dotenv from 'dotenv';

// Load environment variables if present
dotenv.config();

const seedAdmin = async () => {
  try {
    const dbInstance = await initDB();

    // Use environment variables for production security, or fallback to default for MVP/local dev
    const email = process.env.ADMIN_EMAIL || 'admin@africaweb3institute.org';
    const password = process.env.ADMIN_PASSWORD || 'admin';
    const name = process.env.ADMIN_NAME || 'Superadmin';

    const existingUser = dbInstance.get('SELECT * FROM users WHERE email = ?', [email]);
    
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      dbInstance.run(
        'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
        [email, hashedPassword, name, 'superadmin']
      );
      console.log(`✅ Seeded superadmin successfully: ${email}`);
    } else {
      console.log(`✅ Superadmin ${email} already exists in the database.`);
    }

    // Exit cleanly
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding superadmin:', err.message);
    process.exit(1);
  }
};

seedAdmin();
