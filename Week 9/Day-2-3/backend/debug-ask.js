const axios = require('axios');

// Simple test to debug the /ask endpoint step by step
async function debugAskEndpoint() {
  const baseUrl = 'http://localhost:4000';

  console.log('🔍 Debugging /ask endpoint...\n');

  // Test with a very simple question
  const question = 'cricket';

  try {
    console.log(`📤 Sending request: POST ${baseUrl}/ask`);
    console.log(`📝 Body: {"question": "${question}"}`);

    const response = await axios.post(
      `${baseUrl}/ask`,
      {
        question: question,
      },
      {
        timeout: 30000,
        validateStatus: function (status) {
          return status < 500; // Don't throw error for 4xx responses
        },
      },
    );

    console.log('\n✅ Response received:');
    console.log('📊 Status:', response.status);
    console.log('📋 Headers:', response.headers);
    console.log('📄 Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('\n❌ Error occurred:');

    if (error.response) {
      console.log('📊 Status:', error.response.status);
      console.log('📋 Headers:', error.response.headers);
      console.log('📄 Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.code === 'ECONNREFUSED') {
      console.log('🔌 Connection refused - backend not running on port 4000');
    } else if (error.code === 'TIMEOUT') {
      console.log('⏰ Request timed out');
    } else {
      console.log('🚨 Unexpected error:', error.message);
      console.log('📍 Error code:', error.code);
    }
  }
}

debugAskEndpoint().catch(console.error);
