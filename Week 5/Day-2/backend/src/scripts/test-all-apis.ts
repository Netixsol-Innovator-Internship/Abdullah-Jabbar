import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';
import * as path from 'path';

// Configuration
const BASE_URL = 'http://localhost:4000';
const TEST_USERS = [
  {
    username: 'testuser1',
    email: 'testuser1@example.com',
    password: 'password123',
    bio: 'Test user 1 for API testing',
  },
  {
    username: 'testuser2',
    email: 'testuser2@example.com',
    password: 'password123',
    bio: 'Test user 2 for API testing',
  },
];

interface TestUser {
  username: string;
  email: string;
  password: string;
  bio: string;
  token?: string;
  userId?: string;
}

class APITester {
  private client: AxiosInstance;
  private users: TestUser[] = [...TEST_USERS];
  private testData: any = {};

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      validateStatus: () => true, // Don't throw on any status code
    });
  }

  private log(message: string, data?: any) {
    console.log(`🔍 ${message}`);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
    console.log('');
  }

  private logError(message: string, error: any) {
    console.error(`❌ ${message}`);
    console.error(`Status: ${error.response?.status || 'No response'}`);
    console.error(
      `Data: ${JSON.stringify(error.response?.data || error.message, null, 2)}`,
    );
    console.log('');
  }

  private logSuccess(message: string, data?: any) {
    console.log(`✅ ${message}`);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
    console.log('');
  }

  // 1. Test Auth Endpoints
  async testAuthEndpoints() {
    console.log('🔐 TESTING AUTH ENDPOINTS');
    console.log('========================');

    // Test Registration
    for (let i = 0; i < this.users.length; i++) {
      const user = this.users[i];
      try {
        const response = await this.client.post('/auth/register', user);

        if (response.status === 201 || response.status === 200) {
          this.logSuccess(
            `User ${user.username} registered successfully`,
            response.data,
          );
          if (response.data.access_token) {
            user.token = response.data.access_token;
            user.userId = response.data.user?.id || response.data.user?._id;
          }
        } else {
          this.logError(`Failed to register user ${user.username}`, response);
        }
      } catch (error) {
        this.logError(`Error registering user ${user.username}`, error);
      }
    }

    // Test Login
    for (const user of this.users) {
      try {
        const response = await this.client.post('/auth/login', {
          email: user.email,
          password: user.password,
        });

        if (response.status === 200) {
          this.logSuccess(
            `User ${user.username} logged in successfully`,
            response.data,
          );
          if (response.data.access_token) {
            user.token = response.data.access_token;
            user.userId = response.data.user?.id || response.data.user?._id;
          }
        } else {
          this.logError(`Failed to login user ${user.username}`, response);
        }
      } catch (error) {
        this.logError(`Error logging in user ${user.username}`, error);
      }
    }
  }

  // 2. Test User Endpoints
  async testUserEndpoints() {
    console.log('👤 TESTING USER ENDPOINTS');
    console.log('=========================');

    const user = this.users[0];
    if (!user.token) {
      console.log('❌ No token available for user endpoints testing');
      return;
    }

    const headers = { Authorization: `Bearer ${user.token}` };

    // Test GET /users/me
    try {
      const response = await this.client.get('/users/me', { headers });
      if (response.status === 200) {
        this.logSuccess('GET /users/me successful', response.data);
      } else {
        this.logError('GET /users/me failed', response);
      }
    } catch (error) {
      this.logError('Error in GET /users/me', error);
    }

    // Test PUT /users/me
    try {
      const updateData = {
        bio: 'Updated bio from API test',
        profilePicture: 'updated-avatar.jpg',
      };
      const response = await this.client.put('/users/me', updateData, {
        headers,
      });
      if (response.status === 200) {
        this.logSuccess('PUT /users/me successful', response.data);
      } else {
        this.logError('PUT /users/me failed', response);
      }
    } catch (error) {
      this.logError('Error in PUT /users/me', error);
    }

    // Test POST /users/me/upload (create a dummy file)
    try {
      // Create a simple test file
      const testFilePath = path.join(__dirname, 'test-avatar.txt');
      fs.writeFileSync(testFilePath, 'This is a test avatar file');

      const form = new FormData();
      form.append('file', fs.createReadStream(testFilePath));

      const response = await this.client.post('/users/me/upload', form, {
        headers: {
          ...headers,
          ...form.getHeaders(),
        },
      });

      if (response.status === 200 || response.status === 201) {
        this.logSuccess('POST /users/me/upload successful', response.data);
      } else {
        this.logError('POST /users/me/upload failed', response);
      }

      // Cleanup
      fs.unlinkSync(testFilePath);
    } catch (error) {
      this.logError('Error in POST /users/me/upload', error);
    }
  }

  // 3. Test Follower Endpoints
  async testFollowerEndpoints() {
    console.log('👥 TESTING FOLLOWER ENDPOINTS');
    console.log('=============================');

    const user1 = this.users[0];
    const user2 = this.users[1];

    if (!user1.token || !user2.token || !user1.userId || !user2.userId) {
      console.log('❌ Missing tokens or user IDs for follower testing');
      return;
    }

    const headers1 = { Authorization: `Bearer ${user1.token}` };
    const headers2 = { Authorization: `Bearer ${user2.token}` };

    // Test POST /followers/toggle/:targetId (user1 follows user2)
    try {
      const response = await this.client.post(
        `/followers/toggle/${user2.userId}`,
        {},
        { headers: headers1 },
      );
      if (response.status === 200 || response.status === 201) {
        this.logSuccess(`User1 toggled follow for User2`, response.data);
      } else {
        this.logError('POST /followers/toggle failed', response);
      }
    } catch (error) {
      this.logError('Error in POST /followers/toggle', error);
    }

    // Test GET /followers/followers/:userId
    try {
      const response = await this.client.get(
        `/followers/followers/${user2.userId}`,
      );
      if (response.status === 200) {
        this.logSuccess(`GET followers for User2`, response.data);
      } else {
        this.logError('GET /followers/followers failed', response);
      }
    } catch (error) {
      this.logError('Error in GET /followers/followers', error);
    }

    // Test GET /followers/following/:userId
    try {
      const response = await this.client.get(
        `/followers/following/${user1.userId}`,
      );
      if (response.status === 200) {
        this.logSuccess(`GET following for User1`, response.data);
      } else {
        this.logError('GET /followers/following failed', response);
      }
    } catch (error) {
      this.logError('Error in GET /followers/following', error);
    }

    // Test GET /followers/is-following/:targetId
    try {
      const response = await this.client.get(
        `/followers/is-following/${user2.userId}`,
        { headers: headers1 },
      );
      if (response.status === 200) {
        this.logSuccess(`Check if User1 is following User2`, response.data);
      } else {
        this.logError('GET /followers/is-following failed', response);
      }
    } catch (error) {
      this.logError('Error in GET /followers/is-following', error);
    }
  }

  // 4. Test Comment Endpoints
  async testCommentEndpoints() {
    console.log('💬 TESTING COMMENT ENDPOINTS');
    console.log('============================');

    const user = this.users[0];
    if (!user.token) {
      console.log('❌ No token available for comment endpoints testing');
      return;
    }

    const headers = { Authorization: `Bearer ${user.token}` };
    const testPostId = 'test-post-123';

    // Test POST /comments/create
    try {
      const commentData = {
        postId: testPostId,
        text: 'This is a test comment created via API testing',
      };
      const response = await this.client.post('/comments/create', commentData, {
        headers,
      });
      if (response.status === 200 || response.status === 201) {
        this.logSuccess('POST /comments/create successful', response.data);
        this.testData.commentId = response.data._id || response.data.id;
      } else {
        this.logError('POST /comments/create failed', response);
      }
    } catch (error) {
      this.logError('Error in POST /comments/create', error);
    }

    // Test POST /comments/reply
    if (this.testData.commentId) {
      try {
        const replyData = {
          postId: testPostId,
          parentCommentId: this.testData.commentId,
          text: 'This is a test reply to the parent comment',
        };
        const response = await this.client.post('/comments/reply', replyData, {
          headers,
        });
        if (response.status === 200 || response.status === 201) {
          this.logSuccess('POST /comments/reply successful', response.data);
          this.testData.replyId = response.data._id || response.data.id;
        } else {
          this.logError('POST /comments/reply failed', response);
        }
      } catch (error) {
        this.logError('Error in POST /comments/reply', error);
      }
    }

    // Test GET /comments/post/:postId
    try {
      const response = await this.client.get(`/comments/post/${testPostId}`);
      if (response.status === 200) {
        this.logSuccess(`GET comments for post ${testPostId}`, response.data);
      } else {
        this.logError('GET /comments/post/:postId failed', response);
      }
    } catch (error) {
      this.logError('Error in GET /comments/post/:postId', error);
    }

    // Test GET /comments/replies/:parentId
    if (this.testData.commentId) {
      try {
        const response = await this.client.get(
          `/comments/replies/${this.testData.commentId}`,
        );
        if (response.status === 200) {
          this.logSuccess(
            `GET replies for comment ${this.testData.commentId}`,
            response.data,
          );
        } else {
          this.logError('GET /comments/replies/:parentId failed', response);
        }
      } catch (error) {
        this.logError('Error in GET /comments/replies/:parentId', error);
      }
    }

    // Test GET /comments/:id
    if (this.testData.commentId) {
      try {
        const response = await this.client.get(
          `/comments/${this.testData.commentId}`,
        );
        if (response.status === 200) {
          this.logSuccess(
            `GET comment by ID ${this.testData.commentId}`,
            response.data,
          );
        } else {
          this.logError('GET /comments/:id failed', response);
        }
      } catch (error) {
        this.logError('Error in GET /comments/:id', error);
      }
    }
  }

  // 5. Test Like Endpoints
  async testLikeEndpoints() {
    console.log('❤️ TESTING LIKE ENDPOINTS');
    console.log('=========================');

    const user = this.users[0];
    if (!user.token || !this.testData.commentId) {
      console.log(
        '❌ No token or comment ID available for like endpoints testing',
      );
      return;
    }

    const headers = { Authorization: `Bearer ${user.token}` };

    // Test POST /likes/toggle/:commentId
    try {
      const response = await this.client.post(
        `/likes/toggle/${this.testData.commentId}`,
        {},
        { headers },
      );
      if (response.status === 200 || response.status === 201) {
        this.logSuccess(
          `Toggle like for comment ${this.testData.commentId}`,
          response.data,
        );
      } else {
        this.logError('POST /likes/toggle/:commentId failed', response);
      }
    } catch (error) {
      this.logError('Error in POST /likes/toggle/:commentId', error);
    }

    // Test GET /likes/is-liked/:commentId
    try {
      const response = await this.client.get(
        `/likes/is-liked/${this.testData.commentId}`,
        { headers },
      );
      if (response.status === 200) {
        this.logSuccess(
          `Check if comment ${this.testData.commentId} is liked`,
          response.data,
        );
      } else {
        this.logError('GET /likes/is-liked/:commentId failed', response);
      }
    } catch (error) {
      this.logError('Error in GET /likes/is-liked/:commentId', error);
    }
  }

  // 6. Test Notification Endpoints
  async testNotificationEndpoints() {
    console.log('🔔 TESTING NOTIFICATION ENDPOINTS');
    console.log('=================================');

    const user = this.users[0];
    if (!user.token) {
      console.log('❌ No token available for notification endpoints testing');
      return;
    }

    const headers = { Authorization: `Bearer ${user.token}` };

    // Test GET /notifications
    try {
      const response = await this.client.get('/notifications', { headers });
      if (response.status === 200) {
        this.logSuccess('GET /notifications successful', response.data);
        if (response.data && response.data.length > 0) {
          this.testData.notificationId =
            response.data[0]._id || response.data[0].id;
        }
      } else {
        this.logError('GET /notifications failed', response);
      }
    } catch (error) {
      this.logError('Error in GET /notifications', error);
    }

    // Test POST /notifications/mark-read/:id
    if (this.testData.notificationId) {
      try {
        const response = await this.client.post(
          `/notifications/mark-read/${this.testData.notificationId}`,
          {},
          { headers },
        );
        if (response.status === 200) {
          this.logSuccess(
            `Mark notification ${this.testData.notificationId} as read`,
            response.data,
          );
        } else {
          this.logError('POST /notifications/mark-read/:id failed', response);
        }
      } catch (error) {
        this.logError('Error in POST /notifications/mark-read/:id', error);
      }
    }
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 STARTING COMPREHENSIVE API TESTING');
    console.log('======================================\n');

    try {
      await this.testAuthEndpoints();
      await this.testUserEndpoints();
      await this.testFollowerEndpoints();
      await this.testCommentEndpoints();
      await this.testLikeEndpoints();
      await this.testNotificationEndpoints();

      console.log('🎉 API TESTING COMPLETED');
      console.log('========================');
      console.log(
        'Check the logs above for detailed results of each endpoint test.',
      );
      console.log('\n📊 Test Summary:');
      console.log(
        `• Registered users: ${this.users.filter((u) => u.token).length}`,
      );
      console.log(`• Created comments: ${this.testData.commentId ? 1 : 0}`);
      console.log(`• Created replies: ${this.testData.replyId ? 1 : 0}`);
      console.log(
        `• Notifications found: ${this.testData.notificationId ? 'Yes' : 'No'}`,
      );
    } catch (error) {
      console.error('❌ Fatal error during testing:', error);
    }
  }
}

// Run the tests
async function main() {
  console.log(
    '⚠️  Make sure your NestJS server is running on http://localhost:4000',
  );
  console.log('   Start it with: npm run start:dev\n');

  const tester = new APITester();
  await tester.runAllTests();
}

if (require.main === module) {
  main().catch(console.error);
}

export { APITester };
