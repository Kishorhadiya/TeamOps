import { Router } from "express";

import { leaveApproveController, AllLeave, leaveApproveHistory, getDashboardStats } from "../controller/leaveapprove.controller.js";

const router = Router();

router.post("/approve-leave", leaveApproveController);
router.get("/all-leave", AllLeave);
router.put("/leaveupdate", leaveApproveHistory);
router.get("/stats", getDashboardStats);

export default router;

