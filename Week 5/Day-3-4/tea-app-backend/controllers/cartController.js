const Cart = require("../models/Cart");
const Tea = require("../models/Tea");

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { teaId, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const tea = await Tea.findById(teaId);
    if (!tea) return res.status(404).json({ error: "Tea not found" });

    const itemIndex = cart.items.findIndex((i) => i.tea.toString() === teaId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ tea: teaId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { teaId } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter((i) => i.tea.toString() !== teaId);

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.tea"
    );
    res.json(cart || { user: req.user.id, items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// ✅ Update item quantity in

exports.updateCartQuantity = async (req, res) => {
  try {
    const { teaId, quantity } = req.body;

    console.log("🔎 teaId from frontend:", teaId);

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    console.log(
      "🛒 cart items:",
      cart.items.map((i) => i.tea.toString())
    );

    const itemIndex = cart.items.findIndex((i) => i.tea.toString() === teaId);

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not in cart" });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
