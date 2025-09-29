require('dotenv').config();
const { MongoClient } = require('mongodb');

async function testMongoConnection() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cricket';

  console.log('🔗 Testing MongoDB connection...');
  console.log('URI:', uri);

  try {
    const client = new MongoClient(uri);
    await client.connect();

    console.log('✅ Connected to MongoDB successfully!');

    // List databases
    const admin = client.db().admin();
    const dbs = await admin.listDatabases();
    console.log(
      '📁 Available databases:',
      dbs.databases.map((db) => db.name),
    );

    // Check the database specified in the URI (should be 'test' now)
    const dbName = uri.split('/').pop().split('?')[0] || 'test';
    console.log(`🎯 Connecting to database: ${dbName}`);

    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    console.log(
      `📊 Collections in ${dbName} database:`,
      collections.map((col) => col.name),
    );

    // Check collection counts
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`📈 ${collection.name}: ${count} documents`);

      // Show sample document for each collection
      if (count > 0) {
        const sample = await db.collection(collection.name).findOne();
        console.log(
          `📄 Sample from ${collection.name}:`,
          JSON.stringify(sample, null, 2),
        );
      }
    }

    await client.close();
    console.log('✅ MongoDB test completed successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Full error:', error);
  }
}

testMongoConnection().catch(console.error);
