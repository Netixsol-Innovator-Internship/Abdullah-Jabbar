import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

async function addCompleteUser() {
  console.log('👤 Adding a complete sample user with all attributes...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);

  try {
    // Hash the password
    const passwordHash = await bcrypt.hash('mySecurePassword123', 10);

    // Create a comprehensive user with all attributes
    const completeUser = await userService.create({
      username: 'john_developer',
      email: 'john.developer@techcorp.com',
      passwordHash: passwordHash,
      bio: 'Full-stack developer with 5+ years of experience in React, Node.js, and MongoDB. Passionate about clean code and user experience. Currently working on microservices architecture and real-time applications.',
      profilePicture: 'john_developer_avatar.jpg',
      followersCount: 247,
      followingCount: 89,
      createdAt: new Date('2024-01-15T10:30:00Z'), // Custom creation date
    });

    console.log('✅ Complete user created successfully!');
    console.log('\n📋 User Details:');
    console.log('================');
    console.log(`• ID: ${completeUser._id}`);
    console.log(`• Username: ${completeUser.username}`);
    console.log(`• Email: ${completeUser.email}`);
    console.log(`• Bio: ${completeUser.bio}`);
    console.log(`• Profile Picture: ${completeUser.profilePicture}`);
    console.log(`• Followers Count: ${completeUser.followersCount}`);
    console.log(`• Following Count: ${completeUser.followingCount}`);
    console.log(`• Created At: ${completeUser.createdAt}`);
    console.log('• Updated At: Auto-managed by Mongoose (timestamps: true)');

    console.log('\n🔐 Login Credentials:');
    console.log('=====================');
    console.log(`• Username: ${completeUser.username}`);
    console.log(`• Email: ${completeUser.email}`);
    console.log('• Password: mySecurePassword123');

    console.log('\n🎯 This user has ALL attributes populated:');
    console.log('• ✅ Required fields: username, email, passwordHash');
    console.log(
      '• ✅ Optional fields: bio, profilePicture, followersCount, followingCount, createdAt',
    );
    console.log(
      '• ✅ Auto fields: _id, updatedAt (managed by MongoDB/Mongoose)',
    );
  } catch (error) {
    if (error.code === 11000) {
      console.error(
        '❌ User already exists! Username or email must be unique.',
      );
      console.log('💡 Try changing the username or email in the script.');
    } else {
      console.error('❌ Error creating user:', error);
    }
  } finally {
    await app.close();
  }
}

// Run the script
if (require.main === module) {
  addCompleteUser()
    .then(() => {
      console.log('\n✅ Complete user creation script finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

export { addCompleteUser };
