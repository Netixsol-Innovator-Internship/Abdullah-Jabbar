const express = require("express");
const { signup, login } = require("../controllers/authController");

const { deleteUser } = require("../controllers/authController");
const { getAllUser } = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { updateUser } = require("../controllers/authController");
const { getUserProfile } = require("../controllers/authController");
const router = express.Router();

router.get("/all-users", protect, adminOnly, getAllUser);
router.delete("/delete-user/:id", protect, adminOnly, deleteUser);
router.put("/update-user/:id", protect, adminOnly, updateUser);
router.get("/profile", protect, getUserProfile);

router.post("/signup", signup);

router.post("/login", login);

module.exports = router;
