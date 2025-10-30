// list-products.js

// list-products.js
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Product schema (simplified)
const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model('Product', productSchema);

async function listProducts() {
  try {
    console.log('Listing all products in the database...\n');

    const products = await Product.find({}).select(
      'title slug isNewArrival isFeatured',
    );

    console.log(`Found ${products.length} products:\n`);

    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title} (${product.slug})`);
      console.log(`   New Arrival: ${product.isNewArrival || false}`);
      console.log(`   Featured: ${product.isFeatured || false}\n`);
    });
  } catch (error) {
    console.error('❌ Error listing products:', error);
  } finally {
    mongoose.connection.close();
  }
}

listProducts();
