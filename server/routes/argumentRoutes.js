import express from "express";
import { submitArgument } from "../controllers/argumentController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Side A / Side B submit arguments
router.post("/", auth, submitArgument); 

export default router;