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
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [
      "https://penportal-six.vercel.app",
      "http://localhost:5173",
      "https://penportal-6gma3hhl7-talibabbasdevexcelit-6142s-projects.vercel.app",
      "https://penportal-server-git-main-talibabbasdevexcelit-6142s-projects.vercel.app"
    ];

// Simplified CORS middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like curl/postman) or if origin is in the list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`Blocked CORS request from origin: ${origin}`);
      callback(new Error("CORS not allowed for this origin"));
    }
  },
  credentials: true
}));

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
