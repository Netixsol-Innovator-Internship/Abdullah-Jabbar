// Test MongoDB connection
import 'dotenv/config';
import mongoose from 'mongoose';

async function testConnection() {
  try {
    const uri =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/assignments';
    console.log('Attempting to connect to MongoDB...');
    console.log('URI:', uri);

    await mongoose.connect(uri);

    console.log('✓ Successfully connected to MongoDB!');
    console.log('Database name:', mongoose.connection.db.databaseName);

    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('✗ Failed to connect to MongoDB:', error.message);
    console.error('\nMake sure MongoDB is running:');
    console.error(
      '  - Install MongoDB from https://www.mongodb.com/try/download/community',
    );
    console.error('  - Start MongoDB service');
    console.error(
      '  - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas',
    );
    process.exit(1);
  }
}

testConnection();
