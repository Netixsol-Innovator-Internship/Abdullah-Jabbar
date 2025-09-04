const axios = require('axios');

const BASE_URL = 'http://localhost:4000';
let authToken = '';
let userId = '';
let testUserId2 = '';
let testCommentId = '';
let testPostId = 'test-post-123'; // Using a dummy post ID for testing

// Helper function to make requests with better error handling
async function makeRequest(method, endpoint, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      timeout: 10000,
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status || 'ERROR',
      fullError: error.message,
    };
  }
}

// Test functions
async function testRegister() {
  console.log('\n🔐 Testing User Registration...');

  const userData = {
    username: 'testuser' + Date.now(),
    email: 'test' + Date.now() + '@example.com',
    password: 'password123',
    bio: 'Test user bio',
  };

  const result = await makeRequest('POST', '/auth/register', userData);

  if (result.success) {
    console.log('✅ Registration successful');
    authToken = result.data.accessToken;
    // Try to extract user ID from the JWT token payload
    try {
      const payload = JSON.parse(
        Buffer.from(result.data.accessToken.split('.')[1], 'base64').toString(),
      );
      userId = payload.sub;
    } catch (e) {
      console.log('   Could not extract user ID from token');
    }
    console.log('   Token received:', authToken ? 'Yes' : 'No');
    console.log('   User ID:', userId);
  } else {
    console.log('❌ Registration failed:', result.error);
    console.log('   Full error:', result.fullError);
    console.log('   Status:', result.status);
  }

  return result;
}

async function testLogin() {
  console.log('\n🔑 Testing User Login...');

  // First register a user for login test
  const userData = {
    username: 'loginuser' + Date.now(),
    email: 'login' + Date.now() + '@example.com',
    password: 'password123',
    bio: 'Login test user',
  };

  const registerResult = await makeRequest('POST', '/auth/register', userData);

  if (!registerResult.success) {
    console.log('❌ Failed to create user for login test');
    return registerResult;
  }

  // Now test login
  const loginData = {
    email: userData.email,
    password: userData.password,
  };

  const result = await makeRequest('POST', '/auth/login', loginData);

  if (result.success) {
    console.log('✅ Login successful');
    console.log('   Token received:', result.data.accessToken ? 'Yes' : 'No');
  } else {
    console.log('❌ Login failed:', result.error);
  }

  return result;
}

async function testGetCurrentUser() {
  console.log('\n👤 Testing Get Current User...');

  const result = await makeRequest('GET', '/users/me', null, {
    Authorization: `Bearer ${authToken}`,
  });

  if (result.success) {
    console.log('✅ Get current user successful');
    console.log('   Username:', result.data.username);
    console.log('   Email:', result.data.email);
  } else {
    console.log('❌ Get current user failed:', result.error);
  }

  return result;
}

async function testGetUserById() {
  console.log('\n🔍 Testing Get User by ID...');

  if (!userId) {
    console.log('❌ No user ID available for testing');
    return { success: false, error: 'No user ID' };
  }

  const result = await makeRequest('GET', `/users/by-id/${userId}`);

  if (result.success) {
    console.log('✅ Get user by ID successful');
    console.log('   Username:', result.data.username);
  } else {
    console.log('❌ Get user by ID failed:', result.error);
  }

  return result;
}

async function testGetUserByUsername() {
  console.log('\n🔍 Testing Get User by Username...');

  // First get current user to get username
  const currentUser = await makeRequest('GET', '/users/me', null, {
    Authorization: `Bearer ${authToken}`,
  });

  if (!currentUser.success) {
    console.log('❌ Could not get current user for username test');
    return currentUser;
  }

  const username = currentUser.data.username;
  const result = await makeRequest('GET', `/users/by-username/${username}`);

  if (result.success) {
    console.log('✅ Get user by username successful');
    console.log('   Username:', result.data.username);
  } else {
    console.log('❌ Get user by username failed:', result.error);
  }

  return result;
}

async function testUpdateProfile() {
  console.log('\n✏️ Testing Update Profile...');

  const updateData = {
    bio: 'Updated bio - ' + Date.now(),
    // Note: other fields can be added based on your user schema
  };

  const result = await makeRequest('PUT', '/users/me', updateData, {
    Authorization: `Bearer ${authToken}`,
  });

  if (result.success) {
    console.log('✅ Update profile successful');
    console.log('   Updated bio:', result.data.bio);
  } else {
    console.log('❌ Update profile failed:', result.error);
  }

  return result;
}

async function testCreateComment() {
  console.log('\n💬 Testing Create Comment...');

  const commentData = {
    postId: testPostId,
    text: 'This is a test comment - ' + Date.now(),
  };

  const result = await makeRequest('POST', '/comments/create', commentData, {
    Authorization: `Bearer ${authToken}`,
  });

  if (result.success) {
    console.log('✅ Create comment successful');
    testCommentId = result.data._id || result.data.id;
    console.log('   Comment ID:', testCommentId);
    console.log('   Comment text:', result.data.text);
  } else {
    console.log('❌ Create comment failed:', result.error);
  }

  return result;
}

async function testCreateReply() {
  console.log('\n💬 Testing Create Reply...');

  if (!testCommentId) {
    console.log('❌ No parent comment available for reply test');
    return { success: false, error: 'No parent comment' };
  }

  const replyData = {
    postId: testPostId,
    parentCommentId: testCommentId,
    text: 'This is a test reply - ' + Date.now(),
  };

  const result = await makeRequest('POST', '/comments/reply', replyData, {
    Authorization: `Bearer ${authToken}`,
  });

  if (result.success) {
    console.log('✅ Create reply successful');
    console.log('   Reply text:', result.data.text);
    console.log('   Parent comment:', result.data.parentCommentId);
  } else {
    console.log('❌ Create reply failed:', result.error);
  }

  return result;
}

async function testGetCommentsForPost() {
  console.log('\n📋 Testing Get Comments for Post...');

  const result = await makeRequest(
    'GET',
    `/comments/post/${testPostId}?page=0`,
  );

  if (result.success) {
    console.log('✅ Get comments for post successful');
    console.log('   Comments count:', result.data.length || 0);
  } else {
    console.log('❌ Get comments for post failed:', result.error);
  }

  return result;
}

async function testGetReplies() {
  console.log('\n💬 Testing Get Replies...');

  if (!testCommentId) {
    console.log('❌ No parent comment available for replies test');
    return { success: false, error: 'No parent comment' };
  }

  const result = await makeRequest(
    'GET',
    `/comments/replies/${testCommentId}?page=0`,
  );

  if (result.success) {
    console.log('✅ Get replies successful');
    console.log('   Replies count:', result.data.length || 0);
  } else {
    console.log('❌ Get replies failed:', result.error);
  }

  return result;
}

async function testGetCommentById() {
  console.log('\n🔍 Testing Get Comment by ID...');

  if (!testCommentId) {
    console.log('❌ No comment ID available for testing');
    return { success: false, error: 'No comment ID' };
  }

  const result = await makeRequest('GET', `/comments/${testCommentId}`);

  if (result.success) {
    console.log('✅ Get comment by ID successful');
    console.log('   Comment text:', result.data.text);
  } else {
    console.log('❌ Get comment by ID failed:', result.error);
  }

  return result;
}

async function testLikeToggle() {
  console.log('\n❤️ Testing Like Toggle...');

  if (!testCommentId) {
    console.log('❌ No comment ID available for like test');
    return { success: false, error: 'No comment ID' };
  }

  const result = await makeRequest(
    'POST',
    `/likes/toggle/${testCommentId}`,
    null,
    {
      Authorization: `Bearer ${authToken}`,
    },
  );

  if (result.success) {
    console.log('✅ Like toggle successful');
    console.log('   Like result:', result.data);
  } else {
    console.log('❌ Like toggle failed:', result.error);
  }

  return result;
}

async function testIsLiked() {
  console.log('\n❤️ Testing Is Liked...');

  if (!testCommentId) {
    console.log('❌ No comment ID available for is liked test');
    return { success: false, error: 'No comment ID' };
  }

  const result = await makeRequest(
    'GET',
    `/likes/is-liked/${testCommentId}`,
    null,
    {
      Authorization: `Bearer ${authToken}`,
    },
  );

  if (result.success) {
    console.log('✅ Is liked check successful');
    console.log('   Is liked:', result.data.liked);
  } else {
    console.log('❌ Is liked check failed:', result.error);
  }

  return result;
}

async function testCreateSecondUser() {
  console.log('\n👥 Creating Second User for Follow Tests...');

  const userData = {
    username: 'testuser2_' + Date.now(),
    email: 'test2_' + Date.now() + '@example.com',
    password: 'password123',
    bio: 'Second test user',
  };

  const result = await makeRequest('POST', '/auth/register', userData);

  if (result.success) {
    console.log('✅ Second user created successfully');
    try {
      const payload = JSON.parse(
        Buffer.from(result.data.accessToken.split('.')[1], 'base64').toString(),
      );
      testUserId2 = payload.sub;
    } catch (e) {
      console.log('   Could not extract user ID from token');
    }
    console.log('   Second user ID:', testUserId2);
  } else {
    console.log('❌ Second user creation failed:', result.error);
  }

  return result;
}

async function testFollowToggle() {
  console.log('\n👥 Testing Follow Toggle...');

  if (!testUserId2) {
    console.log('❌ No second user ID available for follow test');
    return { success: false, error: 'No second user ID' };
  }

  const result = await makeRequest(
    'POST',
    `/followers/toggle/${testUserId2}`,
    null,
    {
      Authorization: `Bearer ${authToken}`,
    },
  );

  if (result.success) {
    console.log('✅ Follow toggle successful');
    console.log('   Is following:', result.data.isFollowing);
  } else {
    console.log('❌ Follow toggle failed:', result.error);
  }

  return result;
}

async function testGetFollowers() {
  console.log('\n👥 Testing Get Followers...');

  if (!testUserId2) {
    console.log('❌ No user ID available for followers test');
    return { success: false, error: 'No user ID' };
  }

  const result = await makeRequest(
    'GET',
    `/followers/followers/${testUserId2}?page=0`,
  );

  if (result.success) {
    console.log('✅ Get followers successful');
    console.log('   Followers count:', result.data.length || 0);
  } else {
    console.log('❌ Get followers failed:', result.error);
  }

  return result;
}

async function testGetFollowing() {
  console.log('\n👥 Testing Get Following...');

  const result = await makeRequest(
    'GET',
    `/followers/following/${userId}?page=0`,
  );

  if (result.success) {
    console.log('✅ Get following successful');
    console.log('   Following count:', result.data.length || 0);
  } else {
    console.log('❌ Get following failed:', result.error);
  }

  return result;
}

async function testIsFollowing() {
  console.log('\n👥 Testing Is Following...');

  if (!testUserId2) {
    console.log('❌ No target user ID available for is following test');
    return { success: false, error: 'No target user ID' };
  }

  const result = await makeRequest(
    'GET',
    `/followers/is-following/${testUserId2}`,
    null,
    {
      Authorization: `Bearer ${authToken}`,
    },
  );

  if (result.success) {
    console.log('✅ Is following check successful');
    console.log('   Is following:', result.data.isFollowing);
  } else {
    console.log('❌ Is following check failed:', result.error);
  }

  return result;
}

async function testGetNotifications() {
  console.log('\n🔔 Testing Get Notifications...');

  const result = await makeRequest('GET', '/notifications', null, {
    Authorization: `Bearer ${authToken}`,
  });

  if (result.success) {
    console.log('✅ Get notifications successful');
    console.log('   Notifications count:', result.data.length || 0);
  } else {
    console.log('❌ Get notifications failed:', result.error);
  }

  return result;
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting API Endpoint Tests');
  console.log('=====================================');

  const results = [];

  // Authentication tests
  results.push(await testRegister());
  results.push(await testLogin());

  // User tests
  results.push(await testGetCurrentUser());
  results.push(await testGetUserById());
  results.push(await testGetUserByUsername());
  results.push(await testUpdateProfile());

  // Comment tests
  results.push(await testCreateComment());
  results.push(await testCreateReply());
  results.push(await testGetCommentsForPost());
  results.push(await testGetReplies());
  results.push(await testGetCommentById());

  // Like tests
  results.push(await testLikeToggle());
  results.push(await testIsLiked());

  // Follow tests (need second user)
  results.push(await testCreateSecondUser());
  results.push(await testFollowToggle());
  results.push(await testGetFollowers());
  results.push(await testGetFollowing());
  results.push(await testIsFollowing());

  // Notification tests
  results.push(await testGetNotifications());

  // Summary
  console.log('\n📊 Test Results Summary');
  console.log('========================');

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log(`✅ Successful tests: ${successful}`);
  console.log(`❌ Failed tests: ${failed}`);
  console.log(`📊 Total tests: ${results.length}`);
  console.log(
    `🎯 Success rate: ${((successful / results.length) * 100).toFixed(1)}%`,
  );

  console.log('\n🏁 API Testing Complete!');
}

// Run the tests
runAllTests().catch(console.error);
