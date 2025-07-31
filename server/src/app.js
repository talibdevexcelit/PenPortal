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

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://penportal-six.vercel.app",
      "https://penportal-6gma3hhl7-talibabbasdevexcelit-6142s-projects.vercel.app",
      "https://penportal-server-git-main-talibabbasdevexcelit-6142s-projects.vercel.app"
    ];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn("CORS blocked:", origin);
      callback(null, false);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
};

app.use(cors(corsOptions)); // Apply CORS early

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Hello, World!"));
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