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

connectToDatabase();

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://penportal.vercel.app",
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Hello, World!"));

// app.js
app.get("/favicon.ico", (req, res) => res.status(204).end());

app.use("/api/blog", postRoute);
app.use("/api/auth", userRoute);
app.use("/api/admin", adminRoute);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
