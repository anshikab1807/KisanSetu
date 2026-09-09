const express = require("express");
const {
  createRazorpayOrder,
  verifyPayment,
  getRazorpayKey,
} = require("../controllers/paymentController");
const { verifyToken } = require("../utils/authMiddleware");

const router = express.Router();

router.post("/create-order", verifyToken, createRazorpayOrder);
router.post("/verify", verifyToken, verifyPayment);
router.get("/key", verifyToken, getRazorpayKey);

module.exports = router;
