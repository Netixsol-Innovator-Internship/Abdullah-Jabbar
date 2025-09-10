const axios = require('axios');

async function testRegister() {
  const baseURL = 'http://localhost:4000';

  console.log('Testing Register Endpoint...\n');

  // Test 1: Successful registration
  try {
    console.log('Test 1: Successful Registration');
    const response = await axios.post(`${baseURL}/auth/register`, {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'password123',
    });

    console.log('✅ Registration successful');
    console.log('Response:', response.data);
    console.log('---\n');
  } catch (error) {
    console.log('❌ Registration failed');
    console.log('Error:', error.response?.data || error.message);
    console.log('---\n');
  }

  // Test 2: Duplicate email registration
  try {
    console.log('Test 2: Duplicate Email Registration');
    const testEmail = 'duplicate@example.com';

    // First registration
    await axios.post(`${baseURL}/auth/register`, {
      username: 'user1',
      email: testEmail,
      password: 'password123',
    });

    // Second registration with same email
    await axios.post(`${baseURL}/auth/register`, {
      username: 'user2',
      email: testEmail,
      password: 'password123',
    });

    console.log('❌ Should have failed for duplicate email');
    console.log('---\n');
  } catch (error) {
    console.log('✅ Correctly rejected duplicate email');
    console.log('Status:', error.response?.status);
    console.log(
      'Error message:',
      error.response?.data?.message || error.message,
    );
    console.log('---\n');
  }

  // Test 3: Missing required fields
  try {
    console.log('Test 3: Missing Required Fields');
    const response = await axios.post(`${baseURL}/auth/register`, {
      username: 'testuser',
      // Missing email and password
    });

    console.log('❌ Should have failed for missing fields');
    console.log('---\n');
  } catch (error) {
    console.log('✅ Correctly rejected missing fields');
    console.log('Status:', error.response?.status);
    console.log(
      'Error message:',
      error.response?.data?.message || error.message,
    );
    console.log('---\n');
  }
}

testRegister().catch(console.error);
