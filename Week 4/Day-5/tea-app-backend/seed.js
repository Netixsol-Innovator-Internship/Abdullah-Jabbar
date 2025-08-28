// seed.js
const mongoose = require("mongoose");
const Tea = require("./models/Tea"); // adjust path to your Tea model

// MongoDB connection
const MONGO_URI = "mongodb+srv://leoplaner211:123@cluster0.tflkmvi.mongodb.net/?retryWrites=true&w=majority&appName=InternCluster"; // change if needed

const items = [
  {
    image: "item1.jpg",
    name: "Ceylon Ginger Cinnamon Chai Tea",
    weight: "50 g",
    price: 3.95,
    description: "A warm blend of Ceylon ginger and cinnamon perfect for tea lovers.",
    origin: ["India"],
    flavour: ["Spicy"],
    quality: ["Energy"],
    caffeine: "Medium Caffeine",
    allergens: ["Nut-free"],
    organic: "Yes",
    collection: ["Chai"],
  },
  {
    image: "item2.jpg",
    name: "Organic Green Tea",
    weight: "50 g",
    price: 4.25,
    description: "Refreshing green tea sourced from organic farms.",
    origin: ["Japan"],
    flavour: ["Smooth"],
    quality: ["Detox"],
    caffeine: "Low Caffeine",
    allergens: ["Lactose-free"],
    organic: "Yes",
    collection: ["Green tea"],
  },
  {
    image: "item3.jpg",
    name: "Earl Grey Black Tea",
    weight: "50 g",
    price: 4.75,
    description: "Classic black tea infused with bergamot flavor.",
    origin: ["India"],
    flavour: ["Bitter"],
    quality: ["Relax"],
    caffeine: "High Caffeine",
    allergens: ["Gluten-free"],
    organic: "No",
    collection: ["Black tea"],
  },
  {
    image: "item4.jpg",
    name: "Chamomile Herbal Tea",
    weight: "50 g",
    price: 3.45,
    description: "Soothing herbal tea made from pure chamomile flowers.",
    origin: ["Iran"],
    flavour: ["Floral"],
    quality: ["Relax"],
    caffeine: "No Caffeine",
    allergens: ["Lactose-free"],
    organic: "Yes",
    collection: ["Herbal teas"],
  },
  {
    image: "item5.jpg",
    name: "Peppermint Tea",
    weight: "50 g",
    price: 3.85,
    description: "Fresh peppermint leaves for a refreshing cup.",
    origin: ["South Africa"],
    flavour: ["Minty"],
    quality: ["Digestion"],
    caffeine: "No Caffeine",
    allergens: ["Soy-free"],
    organic: "Yes",
    collection: ["Herbal teas"],
  },
  {
    image: "item6.jpg",
    name: "Jasmine Green Tea",
    weight: "50 g",
    price: 4.55,
    description: "Delicate green tea scented with jasmine flowers.",
    origin: ["Japan"],
    flavour: ["Floral"],
    quality: ["Detox"],
    caffeine: "Low Caffeine",
    allergens: ["Nut-free"],
    organic: "No",
    collection: ["Green tea"],
  },
  {
    image: "item7.jpg",
    name: "Masala Chai Tea",
    weight: "50 g",
    price: 4.95,
    description: "Spiced black tea blend for an authentic chai experience.",
    origin: ["India"],
    flavour: ["Spicy"],
    quality: ["Energy"],
    caffeine: "High Caffeine",
    allergens: ["Gluten-free"],
    organic: "No",
    collection: ["Chai"],
  },
  {
    image: "item8.jpg",
    name: "Rooibos Red Tea",
    weight: "50 g",
    price: 3.65,
    description: "Naturally caffeine-free red tea from South Africa.",
    origin: ["South Africa"],
    flavour: ["Smooth"],
    quality: ["Relax"],
    caffeine: "No Caffeine",
    allergens: ["Lactose-free"],
    organic: "Yes",
    collection: ["Rooibos"],
  },
  {
    image: "item9.jpg",
    name: "Lemongrass Herbal Tea",
    weight: "50 g",
    price: 4.35,
    description: "Citrusy and refreshing herbal infusion.",
    origin: ["Iran"],
    flavour: ["Citrus"],
    quality: ["Detox"],
    caffeine: "No Caffeine",
    allergens: ["Soy-free"],
    organic: "Yes",
    collection: ["Herbal teas"],
  },
];


async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected...");

    // Clear old teas
    await Tea.deleteMany({});
    console.log("Old teas removed");

    // Insert new teas
    await Tea.insertMany(items);
    console.log("Seed data inserted");

    mongoose.disconnect();
  } catch (err) {
    console.error("Seeding error:", err);
    mongoose.disconnect();
  }
}

seed();
