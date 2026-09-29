import { Router } from "express";
import { LeaveGetAll,createLeave } from "../controller/leave.controller.js";

const LeaveRoute=Router();

LeaveRoute.post("/createLeave",createLeave);
LeaveRoute.get("/getAllLeaves",LeaveGetAll);

export default LeaveRoute;
