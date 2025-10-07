// Seed sample data for testing (only run if MongoDB is connected)
import 'dotenv/config';
import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  topic: String,
  instructions: String,
  wordCount: Number,
  mode: String,
  createdAt: Date,
});

const submissionSchema = new mongoose.Schema({
  assignmentId: mongoose.Schema.Types.ObjectId,
  studentName: String,
  rollNumber: String,
  rawText: String,
  score: Number,
  remarks: String,
  status: String,
  createdAt: Date,
});

async function seedData() {
  try {
    const uri =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/assignments';
    console.log('Connecting to MongoDB...');

    await mongoose.connect(uri);
    console.log('✓ Connected to MongoDB');

    const Assignment = mongoose.model('Assignment', assignmentSchema);
    const Submission = mongoose.model('Submission', submissionSchema);

    // Clear existing data (optional - comment out if you want to keep data)
    console.log('\nClearing existing data...');
    await Assignment.deleteMany({});
    await Submission.deleteMany({});
    console.log('✓ Data cleared');

    // Create sample assignment
    console.log('\nCreating sample assignment...');
    const assignment = await Assignment.create({
      topic: 'Artificial Intelligence and its Impact on Society',
      instructions:
        'Write a comprehensive essay discussing the impact of AI on modern society. Include both positive and negative aspects.',
      wordCount: 500,
      mode: 'strict',
      createdAt: new Date(),
    });
    console.log('✓ Assignment created:', assignment._id);

    // Create sample submissions
    console.log('\nCreating sample submissions...');
    const sampleSubmissions = [
      {
        assignmentId: assignment._id,
        studentName: 'Alice Johnson',
        rollNumber: 'CS-2024-001',
        rawText:
          'Artificial Intelligence has revolutionized many aspects of our lives. From healthcare to transportation, AI systems are making significant impacts. Machine learning algorithms help doctors diagnose diseases more accurately. Self-driving cars promise to reduce traffic accidents. However, there are concerns about job displacement and privacy issues. We must ensure AI development is ethical and beneficial for all of humanity.',
        score: 85,
        remarks:
          'Excellent analysis of AI impact. Good coverage of both benefits and concerns. Well-structured essay.',
        status: 'evaluated',
        createdAt: new Date(),
      },
      {
        assignmentId: assignment._id,
        studentName: 'Bob Smith',
        rollNumber: 'CS-2024-002',
        rawText:
          'AI is changing the world. It helps in many fields like medicine and business. Companies use AI to analyze data and make better decisions. There are also risks like job loss and ethical concerns. Overall, AI has both good and bad effects on society.',
        score: 65,
        remarks:
          'Basic coverage of the topic. Could benefit from more specific examples and deeper analysis. Consider expanding on the ethical concerns.',
        status: 'evaluated',
        createdAt: new Date(),
      },
      {
        assignmentId: assignment._id,
        studentName: 'Charlie Davis',
        rollNumber: 'CS-2024-003',
        rawText:
          'This submission is pending evaluation. The AI evaluation service will process this text and provide a score and detailed feedback.',
        status: 'pending',
        createdAt: new Date(),
      },
    ];

    await Submission.insertMany(sampleSubmissions);
    console.log(`✓ Created ${sampleSubmissions.length} sample submissions`);

    // Show summary
    console.log('\n=== Data Summary ===');
    const assignmentCount = await Assignment.countDocuments();
    const submissionCount = await Submission.countDocuments();
    const evaluatedCount = await Submission.countDocuments({
      status: 'evaluated',
    });
    const pendingCount = await Submission.countDocuments({ status: 'pending' });

    console.log(`Assignments: ${assignmentCount}`);
    console.log(`Submissions: ${submissionCount}`);
    console.log(`  - Evaluated: ${evaluatedCount}`);
    console.log(`  - Pending: ${pendingCount}`);

    console.log('\n✓ Sample data seeded successfully!');
    console.log(
      `\nYou can now test the API with assignment ID: ${assignment._id}`,
    );

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding data:', error.message);
    process.exit(1);
  }
}

seedData();
