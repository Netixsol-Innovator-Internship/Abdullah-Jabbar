const axios = require('axios');

async function testConnection() {
  try {
    console.log('Testing registration endpoint directly...');
    const userData = {
      username: 'testuser' + Date.now(),
      email: 'test' + Date.now() + '@example.com',
      password: 'password123',
      bio: 'Test user',
    };

    const response = await axios.post(
      'http://localhost:4000/auth/register',
      userData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      },
    );

    console.log('✅ Registration successful');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    return response.data;
  } catch (error) {
    console.log('❌ Registration failed');
    console.log('Error code:', error.code);
    console.log('Error message:', error.message);
    console.log('Response status:', error.response?.status);
    console.log('Response data:', error.response?.data);
    if (error.response) {
      console.log('Response headers:', error.response.headers);
    }
    return null;
  }
}

testConnection().then((result) => {
  if (result) {
    console.log(
      '\n🎉 API is working! Access token received:',
      result.accessToken.substring(0, 50) + '...',
    );
  }
});
