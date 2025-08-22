const Tea = require("../models/Tea");

// Create a new tea
exports.createTea = async (req, res) => {
  try {
    const tea = new Tea(req.body);
    await tea.save();
    res.status(201).json(tea);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all teas
exports.getTeas = async (req, res) => {
  try {
    const teas = await Tea.find();
    res.json(teas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get tea by ID
exports.getTeaById = async (req, res) => {
  try {
    const tea = await Tea.findById(req.params.id);
    if (!tea) return res.status(404).json({ error: "Tea not found" });
    res.json(tea);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update tea
exports.updateTea = async (req, res) => {
  try {
    const tea = await Tea.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!tea) return res.status(404).json({ error: "Tea not found" });
    res.json(tea);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete tea
exports.deleteTea = async (req, res) => {
  try {
    const tea = await Tea.findByIdAndDelete(req.params.id);
    if (!tea) return res.status(404).json({ error: "Tea not found" });
    res.json({ message: "Tea deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.filterTeas = async (req, res) => {
  try {
    const { type, minPrice, maxPrice, minRating } = req.query;
    let query = {};

    if (type) query.type = type;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (minRating) query.rating = { $gte: Number(minRating) };

    const teas = await Tea.find(query);
    res.json(teas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
