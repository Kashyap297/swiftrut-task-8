const express = require("express");
const {
  addExpense,
  bulkAddExpenses,
  getExpenses,
  updateExpense,
  deleteExpenses,
} = require("../controllers/expenseController");
const { protect } = require("../middlewares/authMiddleware");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/", protect, addExpense);
router.post("/bulk", protect, upload.single("file"), bulkAddExpenses);
router.get("/", protect, getExpenses);
router.patch("/:id", protect, updateExpense);
router.delete("/", protect, deleteExpenses);

module.exports = router;
