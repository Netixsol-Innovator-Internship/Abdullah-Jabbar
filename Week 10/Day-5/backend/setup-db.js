// Database indexes setup for better query performance
import 'dotenv/config';
import mongoose from 'mongoose';

async function setupIndexes() {
  try {
    const uri =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/assignments';
    console.log('Connecting to MongoDB...');

    await mongoose.connect(uri);
    console.log('✓ Connected to MongoDB');

    const db = mongoose.connection.db;

    // Create indexes for Assignment collection
    console.log('\nSetting up Assignment indexes...');
    await db.collection('assignments').createIndex({ createdAt: -1 });
    await db.collection('assignments').createIndex({ topic: 1 });
    console.log('✓ Assignment indexes created');

    // Create indexes for Submission collection
    console.log('\nSetting up Submission indexes...');
    await db.collection('submissions').createIndex({ assignmentId: 1 });
    await db
      .collection('submissions')
      .createIndex({ assignmentId: 1, status: 1 });
    await db.collection('submissions').createIndex({ createdAt: -1 });
    await db.collection('submissions').createIndex({ rollNumber: 1 });
    await db
      .collection('submissions')
      .createIndex({ assignmentId: 1, rollNumber: 1 }, { unique: true }); // Prevent duplicate submissions
    console.log('✓ Submission indexes created');

    // List all indexes
    console.log('\n=== Current Indexes ===');
    const assignmentIndexes = await db
      .collection('assignments')
      .listIndexes()
      .toArray();
    console.log('\nAssignments:', JSON.stringify(assignmentIndexes, null, 2));

    const submissionIndexes = await db
      .collection('submissions')
      .listIndexes()
      .toArray();
    console.log('\nSubmissions:', JSON.stringify(submissionIndexes, null, 2));

    await mongoose.disconnect();
    console.log('\n✓ Setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error setting up indexes:', error.message);
    process.exit(1);
  }
}

setupIndexes();
