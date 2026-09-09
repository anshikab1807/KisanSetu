const express = require("express");
const {
  createOrder,
  getConsumerOrders,
  getFarmerOrders,
  getOrder,
  updateOrderStatus,
  getAllOrders,
} = require("../controllers/orderController");
const {
  verifyToken,
  isConsumer,
  isFarmer,
  isAdmin,
} = require("../utils/authMiddleware");
console.log("createOrder:", typeof createOrder);
console.log("getConsumerOrders:", typeof getConsumerOrders);
console.log("getFarmerOrders:", typeof getFarmerOrders);
console.log("getOrder:", typeof getOrder);
console.log("updateOrderStatus:", typeof updateOrderStatus);
console.log("getAllOrders:", typeof getAllOrders);

console.log("verifyToken:", typeof verifyToken);
console.log("isConsumer:", typeof isConsumer);
console.log("isFarmer:", typeof isFarmer);
console.log("isAdmin:", typeof isAdmin);

const router = express.Router();

// Consumer routes
router.post("/", verifyToken, isConsumer, createOrder);
router.get("/consumer", verifyToken, isConsumer, getConsumerOrders);

// Farmer routes
router.get("/farmer", verifyToken, isFarmer, getFarmerOrders);

// Shared routes
router.get("/:id", verifyToken, getOrder);

// Only farmer or admin can update order status
router.put("/:id", verifyToken, (req, res, next) => {
  if (req.user.role === "farmer" || req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }
}, updateOrderStatus);

// Admin routes
router.get("/", verifyToken, isAdmin, getAllOrders);

module.exports = router;
