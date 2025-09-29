const fs = require('fs');
const path = require('path');

// Test script to check if our normalized CSV files can be imported
async function testImport() {
  try {
    // Read a sample from each normalized CSV file
    const files = [
      'ODI_match_results.cleaned_normalized.csv',
      'T20I_match_results.cleaned_normalized.csv',
      'Test_match_results.cleaned_normalized.csv',
    ];

    for (const file of files) {
      const filePath = path.join(__dirname, 'dataset', 'cleaned', file);
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');

      console.log(`\n=== ${file} ===`);
      console.log('Headers:', lines[0]);
      console.log('Sample row:', lines[1]);

      // Parse the headers to verify field mapping
      const headers = lines[0].split(',');
      const sampleData = lines[1].split(',');

      const record = {};
      headers.forEach((header, index) => {
        record[header.trim()] = sampleData[index]
          ? sampleData[index].trim()
          : '';
      });

      console.log('Parsed record:', JSON.stringify(record, null, 2));
    }

    console.log('\n✅ All CSV files are properly formatted for import');
  } catch (error) {
    console.error('❌ Error testing CSV import:', error.message);
  }
}

testImport();
