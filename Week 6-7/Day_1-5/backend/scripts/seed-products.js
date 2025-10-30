// seed-products.js

// seed-products.js
const mongoose = require('mongoose');
const { Types } = mongoose;

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/shop-db',
    );
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Product schema
const ProductSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    shortDescription: String,
    description: String,
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    tags: [String],
    images: [{ url: String, alt: String, order: Number }],
    defaultVariantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductVariant',
    },
    variants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant' }],
    basePrice: { type: mongoose.Schema.Types.Decimal128, required: true },
    currency: { type: String, default: 'USD' },
    salePrice: mongoose.Schema.Types.Decimal128,
    discountPercent: { type: Number, default: 0 },
    isOnSale: { type: Boolean, default: false },
    saleStartsAt: Date,
    saleEndsAt: Date,
    availableColors: [String],
    availableSizes: [String],
    ratingAverage: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    stockStatus: { type: String, default: 'in_stock' },
    metadata: { type: Object, default: {} },
  },
  { timestamps: true },
);

const Product = mongoose.model('Product', ProductSchema);

// Sample products data
const sampleProducts = [
  {
    slug: 'gradient-graphic-t-shirt',
    title: 'Gradient Graphic T-shirt',
    shortDescription: 'Stylish gradient graphic t-shirt for casual wear',
    description:
      'This graphic t-shirt is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.',
    tags: ['casual', 'graphic', 't-shirt', 'unisex'],
    images: [
      { url: '/shop/1.png', alt: 'Gradient Graphic T-shirt Front', order: 1 },
    ],
    basePrice: Types.Decimal128.fromString('145.00'),
    currency: 'USD',
    availableColors: ['black', 'white', 'gray'],
    availableSizes: ['S', 'M', 'L', 'XL'],
    ratingAverage: 3.5,
    reviewCount: 67,
    stockStatus: 'in_stock',
  },
  {
    slug: 'polo-with-tipping-details',
    title: 'Polo with Tipping Details',
    shortDescription: 'Classic polo shirt with elegant tipping details',
    description:
      'A timeless polo shirt featuring subtle tipping details on the collar and cuffs. Made from premium cotton for comfort and durability.',
    tags: ['polo', 'formal', 'casual', 'cotton'],
    images: [
      { url: '/shop/2.png', alt: 'Polo with Tipping Details', order: 1 },
    ],
    basePrice: Types.Decimal128.fromString('180.00'),
    currency: 'USD',
    availableColors: ['navy', 'white', 'red'],
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    ratingAverage: 4.5,
    reviewCount: 89,
    stockStatus: 'in_stock',
  },
  {
    slug: 'black-striped-t-shirt',
    title: 'Black Striped T-shirt',
    shortDescription: 'Classic black striped t-shirt with modern fit',
    description:
      'A versatile black striped t-shirt that pairs well with any outfit. Features a comfortable modern fit and high-quality fabric.',
    tags: ['striped', 't-shirt', 'casual', 'black'],
    images: [{ url: '/shop/3.png', alt: 'Black Striped T-shirt', order: 1 }],
    basePrice: Types.Decimal128.fromString('160.00'),
    salePrice: Types.Decimal128.fromString('120.00'),
    discountPercent: 25,
    isOnSale: true,
    currency: 'USD',
    availableColors: ['black', 'navy'],
    availableSizes: ['S', 'M', 'L', 'XL'],
    ratingAverage: 5.0,
    reviewCount: 123,
    stockStatus: 'in_stock',
  },
  {
    slug: 'skinny-fit-jeans',
    title: 'Skinny Fit Jeans',
    shortDescription: 'Modern skinny fit jeans in premium denim',
    description:
      'Contemporary skinny fit jeans crafted from premium denim. Perfect for creating a sleek, modern silhouette.',
    tags: ['jeans', 'skinny', 'denim', 'pants'],
    images: [{ url: '/shop/4.png', alt: 'Skinny Fit Jeans', order: 1 }],
    basePrice: Types.Decimal128.fromString('260.00'),
    salePrice: Types.Decimal128.fromString('240.00'),
    discountPercent: 8,
    isOnSale: true,
    currency: 'USD',
    availableColors: ['blue', 'black', 'gray'],
    availableSizes: ['28', '30', '32', '34', '36'],
    ratingAverage: 3.5,
    reviewCount: 45,
    stockStatus: 'in_stock',
  },
  {
    slug: 'checkered-shirt',
    title: 'Checkered Shirt',
    shortDescription: 'Classic checkered shirt for smart casual look',
    description:
      'A timeless checkered shirt that works perfectly for both casual and semi-formal occasions. Made from soft cotton blend.',
    tags: ['shirt', 'checkered', 'casual', 'cotton'],
    images: [{ url: '/shop/5.png', alt: 'Checkered Shirt', order: 1 }],
    basePrice: Types.Decimal128.fromString('180.00'),
    currency: 'USD',
    availableColors: ['blue', 'red', 'green'],
    availableSizes: ['S', 'M', 'L', 'XL'],
    ratingAverage: 4.5,
    reviewCount: 67,
    stockStatus: 'in_stock',
  },
  {
    slug: 'sleeve-striped-t-shirt',
    title: 'Sleeve Striped T-shirt',
    shortDescription: 'Trendy t-shirt with sleeve stripe design',
    description:
      'A contemporary t-shirt featuring stylish sleeve stripes. Perfect for adding a modern touch to your casual wardrobe.',
    tags: ['t-shirt', 'striped', 'casual', 'trendy'],
    images: [{ url: '/shop/6.png', alt: 'Sleeve Striped T-shirt', order: 1 }],
    basePrice: Types.Decimal128.fromString('160.00'),
    salePrice: Types.Decimal128.fromString('130.00'),
    discountPercent: 19,
    isOnSale: true,
    currency: 'USD',
    availableColors: ['white', 'black', 'gray'],
    availableSizes: ['S', 'M', 'L', 'XL'],
    ratingAverage: 4.5,
    reviewCount: 89,
    stockStatus: 'in_stock',
  },
];

// Seed function
const seedProducts = async () => {
  try {
    await connectDB();

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${insertedProducts.length} products`);

    console.log('Products seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedProducts();
}

module.exports = { seedProducts };
