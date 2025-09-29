const axios = require('axios');

// Test the LangGraph workflow through the /ask endpoint
async function testLangGraph() {
  const baseUrl = 'http://localhost:3000';

  const testQuestions = [
    'How many matches did India win in ODI format?',
    'What is the highest score by Australia in Test matches?',
    'Show me T20 matches where Pakistan scored more than 180 runs',
    'Which team has the best bowling figures in ODI matches?',
    'What is the weather like today?', // This should be rejected as irrelevant
  ];

  console.log('🧪 Testing LangGraph workflow...\n');

  for (let i = 0; i < testQuestions.length; i++) {
    const question = testQuestions[i];
    console.log(`📋 Test ${i + 1}: "${question}"`);

    try {
      const response = await axios.post(
        `${baseUrl}/ask`,
        {
          question: question,
        },
        {
          timeout: 30000, // 30 second timeout
        },
      );

      console.log('✅ Status:', response.status);
      console.log('📊 Response:', JSON.stringify(response.data, null, 2));

      if (response.data.meta) {
        console.log('🔍 Query used:', response.data.meta.query);
      }
    } catch (error) {
      if (error.response) {
        console.log('❌ Error:', error.response.status, error.response.data);
      } else if (error.code === 'ECONNREFUSED') {
        console.log(
          '❌ Backend server is not running. Please start it with: npm run start:dev',
        );
        break;
      } else {
        console.log('❌ Network error:', error.message);
      }
    }

    console.log('-'.repeat(80));
  }
}

// Test individual services if needed
async function testIndividualServices() {
  console.log('\n🔧 Testing individual service endpoints...\n');

  const baseUrl = 'http://localhost:3000';

  // If you have individual service endpoints, test them here
  // For now, we'll just test the main ask endpoint

  try {
    const healthCheck = await axios.get(`${baseUrl}/`);
    console.log('✅ Backend health check:', healthCheck.status);
  } catch (error) {
    console.log('❌ Backend health check failed:', error.message);
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting LangGraph Tests\n');

  await testIndividualServices();
  await testLangGraph();

  console.log('\n✨ Tests completed!');
}

main().catch(console.error);
