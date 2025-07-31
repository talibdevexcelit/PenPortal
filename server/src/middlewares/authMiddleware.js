import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  // Set CORS headers for error responses
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : [
        "https://penportal-six.vercel.app",
        "http://localhost:5173",
        "https://penportal-6gma3hhl7-talibabbasdevexcelit-6142s-projects.vercel.app",
      ];

  const setCorsHeaders = () => {
    if (!req.headers.origin || allowedOrigins.includes(req.headers.origin)) {
      res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }
  };

  // Check if token exists in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (exclude password)
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        setCorsHeaders();
        return res.status(401).json({
          status: false,
          message: "Not authorized, user not found",
          data: null,
          error: { message: "User not found" },
        });
      }

      next();
    } catch (error) {
      console.error("Auth error:", error);
      setCorsHeaders();
      return res.status(401).json({
        status: false,
        message: "Not authorized, token failed",
        data: null,
        error: { message: "Invalid token" },
      });
    }
  } else {
    setCorsHeaders();
    return res.status(401).json({
      status: false,
      message: "Not authorized, no token",
      data: null,
      error: { message: "Token required" },
    });
  }
};

export const admin = (req, res, next) => {
  // Set CORS headers for error responses
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : [
        "https://penportal-six.vercel.app",
        "http://localhost:5173",
        "https://penportal-6gma3hhl7-talibabbasdevexcelit-6142s-projects.vercel.app",
      ];

  const setCorsHeaders = () => {
    if (!req.headers.origin || allowedOrigins.includes(req.headers.origin)) {
      res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }
  };

  if (req.user && req.user.role === "admin") {
    next();
  } else {
    setCorsHeaders();
    return res.status(403).json({
      status: false,
      message: "Not authorized as an admin",
      data: null,
      error: { message: "Admin access required" },
    });
  }
};