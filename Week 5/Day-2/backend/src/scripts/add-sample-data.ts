import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../user/user.service';
import { CommentService } from '../comment/comment.service';
import { NotificationService } from '../notification/notification.service';
import * as bcrypt from 'bcrypt';
import { Types, Model } from 'mongoose';
import { Comment } from '../comment/schemas/comment.schema';
import { Notification } from '../notification/schemas/notification.schema';
import { getModelToken } from '@nestjs/mongoose';

async function addSampleData() {
  console.log('🚀 Starting to add sample data to database...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);
  const commentModel = app.get<Model<Comment>>(getModelToken(Comment.name));
  const notificationModel = app.get<Model<Notification>>(
    getModelToken(Notification.name),
  );

  try {
    // 1. Create a sample user
    console.log('👤 Creating sample user...');
    const passwordHash = await bcrypt.hash('testpassword123', 10);

    const sampleUser = await userService.create({
      username: 'test_user_' + Date.now(),
      email: `testuser${Date.now()}@example.com`,
      passwordHash,
      bio: 'This is a test user created by the sample data script.',
      profilePicture: 'test-avatar.jpg',
      followersCount: 5,
      followingCount: 3,
    });

    console.log('✅ Sample user created:', {
      id: sampleUser._id,
      username: sampleUser.username,
      email: sampleUser.email,
      bio: sampleUser.bio,
    });

    // Get the user ID as string for further operations
    const userId = (sampleUser._id as Types.ObjectId).toString();

    // 2. Create a sample comment (using direct model access to avoid WebSocket issues)
    console.log('💬 Creating sample comment...');

    const sampleComment = await commentModel.create({
      author: new Types.ObjectId(userId),
      postId: 'sample_post_001',
      text: 'This is a test comment created by the sample data script. It demonstrates how comments are stored in the database with proper user references.',
      likesCount: 0,
      repliesCount: 0,
    });

    console.log('✅ Sample comment created:', {
      id: sampleComment._id,
      postId: sampleComment.postId,
      text: sampleComment.text,
      author: sampleComment.author,
      likesCount: sampleComment.likesCount,
      repliesCount: sampleComment.repliesCount,
    });

    // 3. Create a sample reply comment
    console.log('↩️ Creating sample reply...');
    const sampleReply = await commentModel.create({
      author: new Types.ObjectId(userId),
      postId: 'sample_post_001',
      text: 'This is a reply to the parent comment, showing the threaded comment functionality.',
      parentCommentId: new Types.ObjectId(
        (sampleComment._id as Types.ObjectId).toString(),
      ),
      likesCount: 0,
      repliesCount: 0,
    });

    // Update parent comment's reply count
    await commentModel.findByIdAndUpdate(sampleComment._id, {
      $inc: { repliesCount: 1 },
    });

    console.log('✅ Sample reply created:', {
      id: sampleReply._id,
      parentCommentId: sampleReply.parentCommentId,
      text: sampleReply.text,
    });

    // 4. Create a sample notification (using direct model access)
    console.log('🔔 Creating sample notification...');
    const sampleNotification = await notificationModel.create({
      userId: userId,
      type: 'comment',
      actorId: userId,
      postId: 'sample_post_001',
      commentId: (sampleComment._id as Types.ObjectId).toString(),
      read: false,
    });

    console.log('✅ Sample notification created');

    // 5. Create another notification of different type
    console.log('🔔 Creating sample like notification...');
    const sampleLikeNotification = await notificationModel.create({
      userId: userId,
      type: 'like',
      actorId: userId,
      postId: 'sample_post_001',
      read: false,
    });

    console.log('✅ Sample like notification created');

    console.log('\n🎉 All sample data added successfully!');
    console.log('\n📊 Summary:');
    console.log('• 1 User created');
    console.log('• 1 Parent comment created');
    console.log('• 1 Reply comment created');
    console.log('• 2 Notifications created');

    console.log('\n🔍 You can now test your API endpoints with this data:');
    console.log(`• User ID: ${userId}`);
    console.log(
      `• Comment ID: ${(sampleComment._id as Types.ObjectId).toString()}`,
    );
    console.log(
      `• Reply ID: ${(sampleReply._id as Types.ObjectId).toString()}`,
    );
    console.log(`• Username: ${sampleUser.username}`);
    console.log(`• Email: ${sampleUser.email}`);
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
  } finally {
    await app.close();
  }
}

// Run the script
if (require.main === module) {
  addSampleData()
    .then(() => {
      console.log('✅ Sample data script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Sample data script failed:', error);
      process.exit(1);
    });
}

export { addSampleData };
