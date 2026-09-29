import rateLimit from "express-rate-limit";

// General rate limiter for all standard API requests (100 requests per 15 minutes)
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: "error",
    message: "Too many requests from this IP, please try again after 15 minutes."
  }
});

// Strict rate limiter for sensitive authentication requests (15 requests per 15 minutes)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 login/signup attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many authentication attempts from this IP, please try again after 15 minutes."
  }
});
