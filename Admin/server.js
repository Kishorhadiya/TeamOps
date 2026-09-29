import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { DBConnect } from "./config/pg.config.js";
import { globalLimiter } from "./middleware/rateLimiter.js";
import router from "./Routes/ApproveLeave.route.js";
import Adminrouter from "./Routes/adminauth.route.js";
import TaskRouter from "./Routes/task.route.js";

dotenv.config();

const app = express();

// Trust reverse proxies (e.g. Vercel, Nginx, Cloudflare) for accurate client IP resolution
app.set("trust proxy", 1);

DBConnect();

// Enable CORS for frontend requests
const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie", "Accept", "X-Requested-With"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));


// Apply global rate limiting to all requests
app.use(globalLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  return res.json({ status: "success", message: "Admin API is running successfully!" });
});

app.use("/leave", router);
app.use("/api/v1", Adminrouter);
app.use("/api/v1/task", TaskRouter);

const PORT = process.env.PORT || 8000;

// Start server when run directly (local development)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Admin Server is running at port ${PORT}`);
  });
}

// Export default app for Vercel Serverless Function deployment
export default app;
