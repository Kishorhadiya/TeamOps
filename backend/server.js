import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { DBConnect } from "./config/pg.config.js";
import { globalLimiter } from "./middleware/rateLimiter.js";
import AuthRouter from "./routes/auth.route.js";
import EventRoute from "./routes/event.routes.js";
import LeaveRoute from "./routes/leave.route.js";

dotenv.config();

const app = express();

// Trust reverse proxies (e.g. Vercel, Nginx, Cloudflare) for accurate client IP resolution
app.set("trust proxy", 1);

DBConnect();

// Enable CORS for frontend requests
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
}));

// Apply global rate limiting to all requests
app.use(globalLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ status: "success", message: "Backend API is running successfully!" });
});

app.use("/api/v1", AuthRouter); 
app.use("/api/v1", EventRoute);
app.use("/api/v1", LeaveRoute);

const PORT = process.env.PORT || 3001;

// Start server when run directly (local development)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Backend Server running at port ${PORT}`);
  });
}

// Export default app for Vercel Serverless Function deployment
export default app;
