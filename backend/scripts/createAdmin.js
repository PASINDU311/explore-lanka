const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// .env file එක Load කරගැනීම
dotenv.config({ path: './.env' });

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔄 Connected to Database...');

    // ✏️ ඔයාට කැමති Admin Credentials මෙතැනින් Manual වෙනස් කරන්න
    const adminData = {
      name: 'System Admin',
      email: 'umayanga@gmail.com',        // 👈 ඔයාට ඕන Email එක මෙතැනට දෙන්න
      password: 'umayanga'   // 👈 ඔයාට ඕන Strong Password එක දෙන්න
    };

    // Email එක කලින් තියෙනවාදැයි බැලීම
    const existingUser = await User.findOne({ email: adminData.email });
    if (existingUser) {
      console.log('⚠️ An account with this email already exists!');
      process.exit();
    }

    // Password Hash කිරීම
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Admin Account එක DB එකේ Create කිරීම
    await User.create({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      role: 'admin'
    });

    console.log('====================================');
    console.log('👑 Admin Account Created Successfully!');
    console.log(`Email: ${adminData.email}`);
    console.log('====================================');
    
    process.exit();
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdminUser();