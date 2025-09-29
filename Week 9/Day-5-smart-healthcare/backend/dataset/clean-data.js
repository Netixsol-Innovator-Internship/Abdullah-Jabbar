const fs = require('fs');

// Read the current processed products
const data = JSON.parse(fs.readFileSync('processed_products.json', 'utf8'));

// Remove stock and imageUrl fields from each product
const cleanedData = data.map((product) => {
  const { stock, imageUrl, ...cleanProduct } = product;
  return cleanProduct;
});

// Write back to file
fs.writeFileSync(
  'processed_products.json',
  JSON.stringify(cleanedData, null, 2),
);
console.log(
  `✅ Cleaned ${cleanedData.length} products - removed 'stock' and 'imageUrl' fields`,
);

// Show sample of cleaned data
console.log('\n📋 Sample cleaned product:');
console.log(JSON.stringify(cleanedData[0], null, 2));

console.log('\n📊 Available fields per product:');
console.log(Object.keys(cleanedData[0]).join(', '));
