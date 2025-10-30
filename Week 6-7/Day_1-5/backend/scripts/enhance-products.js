// enhance-products.js

// enhance-products.js
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

const productEnhancements = [
  {
    slug: 'cotton-tshirt',
    updates: {
      images: [
        { url: '/shop/1.png', alt: 'Cotton T-Shirt Front View', order: 1 },
        { url: '/shop/2.png', alt: 'Cotton T-Shirt Back View', order: 2 },
        { url: '/shop/3.png', alt: 'Cotton T-Shirt Side View', order: 3 },
      ],
      availableColors: ['black', 'white', 'gray', 'navy'],
      availableSizes: ['Small', 'Medium', 'Large', 'X-Large'],
      ratingAverage: 4.5,
      reviewCount: 67,
      stockStatus: 'in_stock',
      isOnSale: true,
      salePrice: mongoose.Types.Decimal128.fromString('15.99'),
      discountPercent: 20,
    },
  },
  {
    slug: 'track-pants',
    updates: {
      images: [
        { url: '/shop/4.png', alt: 'Track Pants', order: 1 },
        { url: '/shop/5.png', alt: 'Track Pants Detail', order: 2 },
      ],
      availableColors: ['black', 'gray', 'navy'],
      availableSizes: ['Small', 'Medium', 'Large', 'X-Large'],
      ratingAverage: 4.0,
      reviewCount: 45,
      stockStatus: 'in_stock',
    },
  },
  {
    slug: 'maxi-dress',
    updates: {
      images: [
        { url: '/shop/6.png', alt: 'Maxi Dress', order: 1 },
        { url: '/shop/7.png', alt: 'Maxi Dress Detail', order: 2 },
      ],
      availableColors: ['red', 'blue', 'green', 'black'],
      availableSizes: ['X-Small', 'Small', 'Medium', 'Large'],
      ratingAverage: 4.8,
      reviewCount: 89,
      stockStatus: 'in_stock',
      isOnSale: true,
      salePrice: mongoose.Types.Decimal128.fromString('24.99'),
      discountPercent: 30,
    },
  },
  {
    slug: 'formal-blazer',
    updates: {
      images: [
        { url: '/shop/8.png', alt: 'Formal Blazer', order: 1 },
        { url: '/shop/9.png', alt: 'Formal Blazer Detail', order: 2 },
      ],
      availableColors: ['black', 'navy', 'gray'],
      availableSizes: ['Small', 'Medium', 'Large', 'X-Large'],
      ratingAverage: 4.6,
      reviewCount: 34,
      stockStatus: 'in_stock',
    },
  },
  {
    slug: 'winter-jacket',
    updates: {
      images: [{ url: '/shop/10.png', alt: 'Winter Jacket', order: 1 }],
      availableColors: ['black', 'brown', 'green'],
      availableSizes: ['Medium', 'Large', 'X-Large', 'XX-Large'],
      ratingAverage: 4.3,
      reviewCount: 23,
      stockStatus: 'in_stock',
    },
  },
  {
    slug: 'sports-shorts',
    updates: {
      images: [{ url: '/shop/1.png', alt: 'Sports Shorts', order: 1 }],
      availableColors: ['black', 'blue', 'red'],
      availableSizes: ['Small', 'Medium', 'Large'],
      ratingAverage: 4.1,
      reviewCount: 56,
      stockStatus: 'in_stock',
      isOnSale: true,
      salePrice: mongoose.Types.Decimal128.fromString('9.99'),
      discountPercent: 33,
    },
  },
  {
    slug: 'polo-shirt',
    updates: {
      images: [{ url: '/shop/2.png', alt: 'Polo Shirt', order: 1 }],
      availableColors: ['white', 'black', 'navy', 'red'],
      availableSizes: ['Small', 'Medium', 'Large', 'X-Large'],
      ratingAverage: 4.4,
      reviewCount: 78,
      stockStatus: 'in_stock',
    },
  },
  {
    slug: 'linen-shirt',
    updates: {
      images: [{ url: '/shop/3.png', alt: 'Linen Shirt', order: 1 }],
      availableColors: ['white', 'beige', 'blue'],
      availableSizes: ['Small', 'Medium', 'Large'],
      ratingAverage: 4.2,
      reviewCount: 42,
      stockStatus: 'in_stock',
    },
  },
  {
    slug: 'hooded-sweatshirt',
    updates: {
      images: [{ url: '/shop/4.png', alt: 'Hooded Sweatshirt', order: 1 }],
      availableColors: ['black', 'gray', 'red', 'blue'],
      availableSizes: ['Small', 'Medium', 'Large', 'X-Large'],
      ratingAverage: 4.7,
      reviewCount: 91,
      stockStatus: 'in_stock',
    },
  },
  {
    slug: 'denim-jeans',
    updates: {
      images: [{ url: '/shop/5.png', alt: 'Denim Jeans', order: 1 }],
      availableColors: ['blue', 'black', 'gray'],
      availableSizes: ['28', '30', '32', '34', '36'],
      ratingAverage: 4.5,
      reviewCount: 123,
      stockStatus: 'in_stock',
    },
  },
];

async function enhanceProducts() {
  try {
    console.log('Starting product enhancement...');

    for (const enhancement of productEnhancements) {
      const result = await Product.updateOne(
        { slug: enhancement.slug },
        { $set: enhancement.updates },
      );

      if (result.matchedCount > 0) {
        console.log(`✅ Enhanced product: ${enhancement.slug}`);
      } else {
        console.log(`❌ Product not found: ${enhancement.slug}`);
      }
    }

    console.log('Product enhancement completed!');

    // Display updated products
    const products = await Product.find(
      {},
      'slug title ratingAverage reviewCount stockStatus',
    ).limit(5);
    console.log('\nSample updated products:');
    products.forEach((product) => {
      console.log(
        `- ${product.title} (${product.slug}): ${product.ratingAverage}⭐ (${product.reviewCount} reviews) - ${product.stockStatus}`,
      );
    });
  } catch (error) {
    console.error('Error enhancing products:', error);
  } finally {
    mongoose.connection.close();
  }
}

enhanceProducts();
