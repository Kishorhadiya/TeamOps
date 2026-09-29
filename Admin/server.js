import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { DBConnect } from "./config/pg.config.js";
import { globalLimiter } from "./middleware/rateLimiter.js";
import router from "./Routes/ApproveLeave.route.js";
import Adminrouter from "./Routes/adminauth.route.js";
import TaskRouter from "./Routes/task.route.js";

const app = express();

// Trust reverse proxies (e.g. Vercel, Nginx, Cloudflare) for accurate client IP resolution
app.set("trust proxy", 1);

DBConnect();

// Parse FRONTEND_URL from .env (comma-separated or single URL)
const rawFrontendUrls =
  process.env.FRONTEND_URL ||
  "http://localhost:5173,http://localhost:3000,http://localhost:5174";

const allowedOrigins = rawFrontendUrls
  .split(",")
  .map((url) => url.trim().replace(/\/+$/, ""))
  .filter(Boolean);

// Enable CORS for frontend requests
const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g., Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/+$/, "");

    const isAllowed =
      allowedOrigins.includes("*") ||
      allowedOrigins.includes(normalizedOrigin) ||
      process.env.NODE_ENV !== "production" ||
      normalizedOrigin.includes("localhost") ||
      normalizedOrigin.includes("127.0.0.1") ||
      normalizedOrigin.endsWith(".vercel.app");

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cookie",
    "Accept",
    "X-Requested-With",
  ],
};

app.use(cors(corsOptions));

// Apply global rate limiting to all requests
app.use(globalLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  return res.json({
    status: "success",
    message: "Admin API is running successfully!",
    allowedOrigins,
  });
});

// Mount routes (both standard and /api/v1 prefixed for compatibility)
app.use("/leave", router);
app.use("/api/v1/leave", router);
app.use("/task", TaskRouter);
app.use("/api/v1/task", TaskRouter);
app.use("/api/v1", Adminrouter);

const PORT = process.env.PORT || 8000;

// Start server when run directly (local development)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Admin Server is running at port ${PORT}`);
  });
}

// Export default app for Vercel Serverless Function deployment
export default app;
