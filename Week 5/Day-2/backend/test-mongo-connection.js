const mongoose = require('mongoose');
require('dotenv').config();

async function testMongoConnection() {
  try {
    console.log('🔗 Testing MongoDB connection...');
    console.log(
      'MongoDB URI:',
      process.env.MONGO_URI?.replace(/\/\/[^:]*:[^@]*@/, '//***:***@'),
    );

    await mongoose.connect(process.env.MONGO_URI, {
      retryWrites: true,
      w: 'majority',
    });

    console.log('✅ MongoDB connected successfully!');
    console.log('📊 Connection details:');
    console.log('  - Database:', mongoose.connection.db.databaseName);
    console.log('  - Host:', mongoose.connection.host);
    console.log('  - Port:', mongoose.connection.port);
    console.log('  - Ready State:', mongoose.connection.readyState); // 1 = connected

    // Test a simple operation
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      '📁 Available collections:',
      collections.map((c) => c.name),
    );

    await mongoose.connection.close();
    console.log('🔌 Connection closed');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

testMongoConnection();
