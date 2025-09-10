const express = require("express");
const {
  createTea,
  getTeas,
  getTeaById,
  updateTea,
  deleteTea,
  filterTeas,
} = require("../controllers/teaController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();



router.post("/", protect, adminOnly, createTea);

router.get("/", getTeas);



router.get("/filter", filterTeas);

router.get("/:id", getTeaById);

router.put("/:id", protect, adminOnly, updateTea);

router.delete("/:id", protect, adminOnly, deleteTea);

module.exports = router;
