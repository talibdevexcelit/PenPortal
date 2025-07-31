// ./app.js
import express from "express";
import dotenv from "dotenv";
import postRoute from "./routes/postRoute.js";
import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import { connectToDatabase } from "./db/connect.js";
import { corsMiddleware } from "./middlewares/corsMiddleware.js";

dotenv.config();

const app = express();

// Connect to MongoDB
connectToDatabase().catch((err) => {
  console.error("Failed to connect to MongoDB:", err);
  process.exit(1);
});

// Use custom CORS middleware FIRST
app.use(corsMiddleware);

// JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Hello, World! Backend is running." });
});

app.get("/api/test", (req, res) => {
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

// Error middleware (must come after routes)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: "Route not found",
    data: null,
    error: { message: "Not found" },
  });
});

export default app;