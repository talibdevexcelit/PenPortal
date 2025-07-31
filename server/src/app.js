import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import postRoute from "./routes/postRoute.js";
import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import { connectToDatabase } from "./db/connect.js";

dotenv.config();
const app = express();

// Connect to MongoDB
connectToDatabase().catch((err) => {
  console.error("Failed to connect to MongoDB:", err);
  process.exit(1);
});

// Allowed origins
const BASE_URL = process.env.BASE_URL;

// Simplified CORS middleware
app.use(
  cors({
    origin: BASE_URL,
    credentials: true,
  })
);

// JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
  console.log("Request to / from:", req.headers.origin);
  res.json({ message: "Hello, World! Backend is running." });
});

app.get("/api/test", (req, res) => {
  console.log("Request to /api/test from:", req.headers.origin);
  res.json({
    status: true,
    message: "Public test endpoint",
    data: null,
    error: null,
  });
});

// Favicon ignore
app.get("/favicon.ico", (req, res) => res.status(204).end());

// Routes
app.use("/api/blog", postRoute);
app.use("/api/auth", userRoute);
app.use("/api/admin", adminRoute);

// Error middleware
app.use(errorHandler);

// 404
app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: "Route not found",
    data: null,
    error: { message: "Not found" },
  });
});

export default app;
