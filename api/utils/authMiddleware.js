const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

// Middleware to protect routes
exports.verifyToken = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      if (!process.env.JWT_SECRET) {
        console.error("❌ JWT_SECRET missing in .env");
        return res
          .status(500)
          .json({
            success: false,
            message: "Server misconfiguration: JWT secret missing",
          });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(404).json({
          success: false,
          message: "User not found for this token",
        });
      }

      next();
    } catch (error) {
      console.error("JWT verification failed:", error.message);
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token provided" });
  }
};

// Middleware: Only allow Admins
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res
      .status(403)
      .json({ success: false, message: "Access denied: Admins only" });
  }
};

// Middleware: Only allow Farmers
exports.isFarmer = (req, res, next) => {
  if (req.user && req.user.role === "farmer") {
    next();
  } else {
    return res
      .status(403)
      .json({ success: false, message: "Access denied: Farmers only" });
  }
};
exports.isConsumer = (req, res, next) => {
  if (req.user && req.user.role === "consumer") {
    return next();
  }
  return res.status(403).json({ success: false, message: "Access denied: Consumers only" });
};
