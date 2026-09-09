const express = require("express");
const {
  getAllFarmers,
  getFarmerProfile,
  updateFarmerProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
} = require("../controllers/userController");
const { verifyToken, isAdmin, isFarmer } = require("../utils/authMiddleware");
console.log("verifyToken type:", typeof verifyToken);
console.log("isAdmin type:", typeof isAdmin);
console.log("isFarmer type:", typeof isFarmer);
const router = express.Router();

// Public routes
router.get("/farmers", getAllFarmers);
router.get("/farmers/:id", getFarmerProfile);

// Private routes
router.put("/profile", verifyToken, updateUserProfile);
router.put("/farmers/profile", verifyToken, isFarmer, updateFarmerProfile);

// Admin routes
router.get("/", verifyToken, isAdmin, getAllUsers);
router.delete("/:id", verifyToken, isAdmin, deleteUser);

module.exports = router;
