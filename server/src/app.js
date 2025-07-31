import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import postRoute from "./routes/postRoute.js";
import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import { connectToDatabase } from "./db/connect.js";

const app = express();
dotenv.config();

// Connect to MongoDB
connectToDatabase().catch((err) => {
  console.error("Failed to connect to MongoDB:", err);
  process.exit(1); // Exit if MongoDB connection fails
});

// CORS configuration
const allowedOrigins = [
  "https://penportal-six.vercel.app", // Production frontend
  "http://localhost:5173", // Local development
  "https://penportal-6gma3hhl7-talibabbasdevexcelit-6142s-projects.vercel.app", // Preview deployment
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`CORS blocked for origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route for testing
app.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*"); // Fallback for debugging
  res.json({ message: "Hello, World! Backend is running." });
});

// Handle favicon requests
app.get("/favicon.ico", (req, res) => res.status(204).end());

// API routes
app.use("/api/blog", postRoute);
app.use("/api/auth", userRoute);
app.use("/api/admin", adminRoute);

// Error handling middleware (must be after routes)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Export for Vercel serverless
export default app;