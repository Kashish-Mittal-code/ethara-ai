const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/models/User');

async function verifyTestUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Verify the test user email
    const result = await User.updateOne(
      { email: 'test@example.com' },
      { emailVerified: true }
    );

    if (result.matchedCount === 0) {
      console.log('User not found');
    } else {
      console.log('✓ Email verified for test@example.com');
    }

    await mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

verifyTestUser();
