const mongoose = require("mongoose");

const teaSchema = new mongoose.Schema(
  {
    collection: {
      type: [String],
      enum: [
        "Black tea",
        "Green tea",
        "White tea",
        "Chai",
        "Matcha",
        "Herbal teas",
        "Oolong",
        "Rooibos",
        "Tisane",
      ],
      required: true,
    },
    origin: {
      type: [String],
      enum: ["India", "Japan", "Sri Lanka", "South Africa","Iran"],
      required: true,
    },
    flavour: {
      type: [String],
      enum: [
        "Spicy",
        "Sweet",
        "Citrus",
        "Smooth",
        "Fruity",
        "Floral",
        "Grassy",
        "Minty",
        "Bitter",
        "Creamy",
      ],
      default: [],
    },
    quality: {
      type: [String],
      enum: ["Detox", "Energy", "Relax", "Digestion"],
      default: [],
    },
    caffeine: {
      type: String,
      enum: ["No Caffeine", "Low Caffeine", "Medium Caffeine", "High Caffeine"],
      required: true,
    },
    allergens: {
      type: [String],
      enum: ["Lactose-free", "Gluten-free", "Nut-free", "Soy-free"],
      default: [],
    },
    organic: {
      type: String,
      enum: ["Yes", "No"],
      required: true,
    },
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tea", teaSchema);
