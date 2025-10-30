// set-product-flags.js

// set-product-flags.js
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

async function setProductFlags() {
  try {
    console.log(
      'Setting product flags for New Arrivals and Featured products...',
    );

    // Mark some products as New Arrivals
    const newArrivalSlugs = [
      'cotton-tshirt',
      'track-pants',
      'maxi-dress',
      'summer-shorts',
    ];
    await Product.updateMany(
      { slug: { $in: newArrivalSlugs } },
      { $set: { isNewArrival: true } },
    );
    console.log(`✓ Marked ${newArrivalSlugs.length} products as New Arrivals`);

    // Mark some products as Featured (Top Selling)
    const featuredSlugs = [
      'cotton-tshirt',
      'formal-blazer',
      'winter-jacket',
      'polo-shirt',
    ];
    await Product.updateMany(
      { slug: { $in: featuredSlugs } },
      { $set: { isFeatured: true } },
    );
    console.log(`✓ Marked ${featuredSlugs.length} products as Featured`);

    // Show current state
    const newArrivals = await Product.find({ isNewArrival: true }).select(
      'title slug',
    );
    const featured = await Product.find({ isFeatured: true }).select(
      'title slug',
    );

    console.log('\nNew Arrivals:');
    newArrivals.forEach((product) => {
      console.log(`  - ${product.title} (${product.slug})`);
    });

    console.log('\nFeatured Products:');
    featured.forEach((product) => {
      console.log(`  - ${product.title} (${product.slug})`);
    });

    console.log('\n✅ Product flags set successfully!');
  } catch (error) {
    console.error('❌ Error setting product flags:', error);
  } finally {
    mongoose.connection.close();
  }
}

setProductFlags();
