// update-prices.js

// update-prices.js
// Usage:
//   node update-prices.js            # perform updates against DB
//   node update-prices.js --dry-run  # show what would be updated

const mongoose = require('mongoose');
const { Types } = mongoose;

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/shop-db';

const ProductSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    basePrice: { type: mongoose.Schema.Types.Decimal128, required: true },
    currency: { type: String, default: 'USD' },
  },
  { timestamps: true },
);

const Product = mongoose.model('Product', ProductSchema);

function randPrice(min = 80, max = 250) {
  const v = Math.random() * (max - min) + min;
  return Number(v.toFixed(2));
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB:', MONGODB_URI);

    // fetch candidates (we'll filter in JS to safely handle Decimal128)
    const all = await Product.find({}).select('slug title basePrice').exec();
    const candidates = all.filter((p) => {
      if (!p.basePrice) return false;
      try {
        const num = Number(p.basePrice.toString());
        return num < 50;
      } catch (e) {
        return false;
      }
    });

    if (candidates.length === 0) {
      console.log('No products found with price < $50');
      process.exit(0);
    }

    console.log(`Found ${candidates.length} products with basePrice < $50`);

    if (dryRun) {
      console.log(
        'Dry run: showing planned updates (slug, oldPrice -> newPrice)',
      );
      candidates.forEach((p) => {
        const oldP = Number(p.basePrice.toString()).toFixed(2);
        const newP = randPrice().toFixed(2);
        console.log(`${p.slug} : $${oldP} -> $${newP}`);
      });
      process.exit(0);
    }

    // perform updates
    for (const p of candidates) {
      const oldP = Number(p.basePrice.toString()).toFixed(2);
      const newVal = randPrice();
      p.basePrice = Types.Decimal128.fromString(newVal.toFixed(2));
      await p.save();
      console.log(`Updated ${p.slug} : $${oldP} -> $${newVal.toFixed(2)}`);
    }

    console.log('Price updates complete');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
