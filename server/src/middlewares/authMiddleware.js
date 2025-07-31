// ./middlewares/authMiddleware.js

import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  // Check if token exists in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          status: false,
          message: "Not authorized, user not found",
          data: null,
          error: { message: "User not found" },
        });
      }

      return next();
    } catch (error) {
      console.error("Auth error:", error);
      return res.status(401).json({
        status: false,
        message: "Not authorized, token failed",
        data: null,
        error: { message: "Invalid token" },
      });
    }
  }

  // No token provided
  return res.status(401).json({
    status: false,
    message: "Not authorized, no token",
    data: null,
    error: { message: "Token required" },
  });
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    status: false,
    message: "Not authorized as an admin",
    data: null,
    error: { message: "Admin access required" },
  });
};