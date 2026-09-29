import { Router } from "express";
import { signup, sigin } from "../controller/auth.controller.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const AuthRouter = Router();

AuthRouter.post("/signup", authLimiter, signup);
AuthRouter.post("/login", authLimiter, sigin);
AuthRouter.post("/signin", authLimiter, sigin);
AuthRouter.post("/sigin", authLimiter, sigin);

export default AuthRouter;
