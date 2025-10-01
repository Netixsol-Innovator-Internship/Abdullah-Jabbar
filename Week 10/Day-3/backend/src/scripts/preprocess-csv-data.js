const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

/**
 * Preprocessing script for healthcare products CSV data
 * Converts CSV format to MongoDB-ready JSON format
 */

const inputFile = path.join(__dirname, '../../dataset/healthcare_products.csv');
const outputFile = path.join(
  __dirname,
  '../../dataset/processed_products.json',
);

const processedProducts = [];

console.log('🚀 Starting CSV preprocessing...');
console.log(`📁 Input file: ${inputFile}`);
console.log(`📁 Output file: ${outputFile}`);

// Function to clean and parse ingredients
function parseIngredients(ingredientsString) {
  if (!ingredientsString) return [];

  // Remove outer quotes if present and split by comma
  const cleaned = ingredientsString.replace(/^"|"$/g, '');
  return cleaned.split(',').map((ingredient) => ingredient.trim());
}

// Function to clean product names (remove redundant category and ID)
function cleanProductName(name, category) {
  // Remove trailing ID number (space + number at the end)
  let cleanName = name.replace(/\s+\d+$/, '');

  return cleanName.trim();
}

// Function to enhance description
function enhanceDescription(description, category, brand) {
  // Replace generic descriptions with more meaningful ones
  if (
    description.includes('supplement by') &&
    description.includes('for health support')
  ) {
    const categoryLower = category.toLowerCase();
    let enhancedDesc = `Premium ${categoryLower} supplement by ${brand}. `;

    switch (category.toLowerCase()) {
      case 'multivitamin':
        enhancedDesc +=
          'Complete daily nutrition with essential vitamins and minerals to support overall health and wellness.';
        break;
      case 'omega-3 supplement':
        enhancedDesc +=
          'High-quality omega-3 fatty acids to support heart health, brain function, and reduce inflammation.';
        break;
      case 'probiotics':
        enhancedDesc +=
          'Live beneficial bacteria to support digestive health and boost immune system function.';
        break;
      case 'immune support':
        enhancedDesc +=
          'Powerful blend of vitamins and antioxidants to strengthen your natural defense system.';
        break;
      case 'energy support':
        enhancedDesc +=
          'Natural energy-boosting formula to combat fatigue and enhance daily performance.';
        break;
      case 'sleep support':
        enhancedDesc +=
          'Gentle, natural ingredients to promote restful sleep and healthy sleep cycles.';
        break;
      case 'joint health':
        enhancedDesc +=
          'Comprehensive joint support formula to maintain mobility and reduce discomfort.';
        break;
      case 'calcium supplement':
        enhancedDesc +=
          'Essential calcium and supporting nutrients for strong bones and teeth.';
        break;
      case 'herbal supplement':
        enhancedDesc +=
          'Traditional herbal blend crafted for natural wellness and vitality.';
        break;
      case 'detox':
        enhancedDesc +=
          'Natural detoxification support to cleanse and rejuvenate your body.';
        break;
      default:
        enhancedDesc +=
          'Carefully formulated to support your health and wellness goals.';
    }

    return enhancedDesc;
  }

  return description;
}

// Read and process CSV file
fs.createReadStream(inputFile)
  .pipe(csv())
  .on('data', (row) => {
    try {
      const processedProduct = {
        name: cleanProductName(row.name, row.category),
        category: row.category,
        brand: row.brand,
        description: enhanceDescription(
          row.description,
          row.category,
          row.brand,
        ),
        price: parseFloat(row.price),
        ingredients: parseIngredients(row.ingredients),
        dosage: row.dosage,
      };

      // Validate required fields
      if (
        !processedProduct.name ||
        !processedProduct.category ||
        !processedProduct.brand ||
        !processedProduct.description ||
        isNaN(processedProduct.price)
      ) {
        console.warn(`⚠️  Skipping invalid product: ${row.name}`);
        return;
      }

      processedProducts.push(processedProduct);
    } catch (error) {
      console.error(`❌ Error processing row ${row.id}: ${error.message}`);
    }
  })
  .on('end', () => {
    console.log(
      `✅ Successfully processed ${processedProducts.length} products`,
    );

    // Write processed data to JSON file
    fs.writeFileSync(outputFile, JSON.stringify(processedProducts, null, 2));
    console.log(`💾 Data saved to: ${outputFile}`);

    // Generate summary statistics
    generateSummary();
  })
  .on('error', (error) => {
    console.error('❌ Error reading CSV file:', error.message);
  });

function generateSummary() {
  console.log('\n📊 Data Summary:');
  console.log(`Total products: ${processedProducts.length}`);

  // Category distribution
  const categoryCount = {};
  const brandCount = {};
  let totalValue = 0;
  let minPrice = Infinity;
  let maxPrice = -Infinity;

  processedProducts.forEach((product) => {
    categoryCount[product.category] =
      (categoryCount[product.category] || 0) + 1;
    brandCount[product.brand] = (brandCount[product.brand] || 0) + 1;
    totalValue += product.price; // Remove stock calculation
    minPrice = Math.min(minPrice, product.price);
    maxPrice = Math.max(maxPrice, product.price);
  });

  console.log('\n📈 Categories:');
  Object.entries(categoryCount)
    .sort(([, a], [, b]) => b - a)
    .forEach(([category, count]) => {
      console.log(`  ${category}: ${count} products`);
    });

  console.log('\n🏷️  Brands:');
  Object.entries(brandCount)
    .sort(([, a], [, b]) => b - a)
    .forEach(([brand, count]) => {
      console.log(`  ${brand}: ${count} products`);
    });

  console.log('\n💰 Price Analysis:');
  console.log(`  Min price: $${minPrice.toFixed(2)}`);
  console.log(`  Max price: $${maxPrice.toFixed(2)}`);
  console.log(
    `  Avg price: $${(processedProducts.reduce((sum, p) => sum + p.price, 0) / processedProducts.length).toFixed(2)}`,
  );
  console.log(`  Total inventory value: $${totalValue.toFixed(2)}`);

  console.log('\n🎯 Ready for database seeding!');
}
