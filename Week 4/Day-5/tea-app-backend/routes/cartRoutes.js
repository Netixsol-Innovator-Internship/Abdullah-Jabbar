const express = require("express");
const {
  addToCart,
  removeFromCart,
  getCart,
  updateCartQuantity,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart operations
 */

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teaId
 *               - quantity
 *             properties:
 *               teaId:
 *                 type: string
 *                 example: 64de123abc456def7890
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Item added to cart
 *       401:
 *         description: Unauthorized
 */
router.post("/add", protect, addToCart);

/**
 * @swagger
 * /api/cart/remove:
 *   post:
 *     summary: Remove an item from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teaId
 *             properties:
 *               teaId:
 *                 type: string
 *                 example: 64de123abc456def7890
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       401:
 *         description: Unauthorized
 */
router.post("/remove", protect, removeFromCart);

/**
 * @swagger
 * /api/cart/:
 *   get:
 *     summary: Get all items in the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cart items
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getCart);

/**
 * @swagger
 * /api/cart/update:
 *   post:
 *     summary: Update the quantity of an item in the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teaId
 *               - quantity
 *             properties:
 *               teaId:
 *                 type: string
 *                 example: 64de123abc456def7890
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/update", protect, updateCartQuantity);

module.exports = router;
