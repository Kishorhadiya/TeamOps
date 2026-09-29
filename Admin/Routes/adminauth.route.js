import { Router } from "express";
import { adminsignin, adminsignup, refreshAccessToken, getAllUsers } from "../controller/adminauth.controller.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const Adminrouter = Router();

Adminrouter.post("/adminsignup", authLimiter, adminsignup);
Adminrouter.post("/adminsignin", authLimiter, adminsignin);
Adminrouter.post("/refresh-token", authLimiter, refreshAccessToken);
Adminrouter.get("/users", getAllUsers);

export default Adminrouter;