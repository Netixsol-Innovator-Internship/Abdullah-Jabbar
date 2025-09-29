// Quick test script to verify the optimized CSV upload
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

async function testCsvUpload() {
  try {
    // Read a sample CSV file (using ODI data)
    const csvPath = './dataset/cleaned/ODI_match_results.cleaned.csv';

    if (!fs.existsSync(csvPath)) {
      console.log('CSV file not found:', csvPath);
      return;
    }

    const fileBuffer = fs.readFileSync(csvPath);
    console.log(`Testing upload with ${fileBuffer.length} bytes`);

    const form = new FormData();
    form.append('file', fileBuffer, 'test.csv');
    form.append('format', 'odi');

    const startTime = Date.now();

    const response = await axios.post('http://localhost:3000/upload', form, {
      headers: {
        ...form.getHeaders(),
      },
      timeout: 60000, // 60 seconds timeout
    });

    const duration = Date.now() - startTime;
    console.log(`Upload completed in ${duration}ms`);
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
console.log('Starting CSV upload test...');
testCsvUpload();
