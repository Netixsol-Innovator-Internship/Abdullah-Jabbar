require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Import the CSV importer function
async function importData() {
  // Import the TypeScript module dynamically
  const { csvStreamImport } = await import('./src/utils/csv-importer.js');

  const cleanedDataPath = path.join(__dirname, 'dataset', 'cleaned');

  const files = [
    {
      path: path.join(
        cleanedDataPath,
        'ODI_match_results.cleaned_normalized.csv',
      ),
      collection: 'odi-matches',
    },
    {
      path: path.join(
        cleanedDataPath,
        'T20I_match_results.cleaned_normalized.csv',
      ),
      collection: 't20-matches',
    },
    {
      path: path.join(
        cleanedDataPath,
        'Test_match_results.cleaned_normalized.csv',
      ),
      collection: 'test-matches',
    },
  ];

  console.log('🚀 Starting data import process...\n');

  for (const file of files) {
    console.log(
      `📁 Importing ${file.collection} from ${path.basename(file.path)}`,
    );

    try {
      if (!fs.existsSync(file.path)) {
        console.log(`❌ File not found: ${file.path}`);
        continue;
      }

      const stream = fs.createReadStream(file.path);
      const result = await csvStreamImport(stream, file.collection);

      console.log(`✅ Import completed for ${file.collection}:`);
      console.log(`   📊 Total processed: ${result.importedCount}`);
      console.log(`   ➕ Inserted: ${result.insertedCount}`);
      console.log(`   🔄 Upserted: ${result.upsertedCount}`);
      console.log(`   ✏️  Modified: ${result.modifiedCount}\n`);
    } catch (error) {
      console.log(`❌ Error importing ${file.collection}:`, error.message);
    }
  }

  console.log('✨ Data import process completed!');
}

importData().catch(console.error);
