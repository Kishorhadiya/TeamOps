import { Router } from "express";
import { createEvent ,GetAllEvents,DeleteEvent} from "../controller/events.controller.js";

const EventRoute = Router();

EventRoute.post("/eventcreate", createEvent);
EventRoute.get("/allevents", GetAllEvents);
EventRoute.delete("/deleteevent/:id",DeleteEvent);

export default EventRoute;
