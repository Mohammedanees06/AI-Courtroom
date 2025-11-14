import express from "express";
import {
  createCase,
  getUserCases,
  getCaseById,
  joinCase,
  getCaseMessages,
} from "../controllers/caseController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

/**
 * CASE ROUTES — Order matters!
 * Always put static routes BEFORE dynamic ones (/:caseId)
 */

//  Create a new case
router.post("/create", auth, createCase);

// Get all cases created by current user
router.get("/", auth, getUserCases);

//  Join a case as Side A or B
router.post("/:caseId/join", auth, joinCase);

//  Get all arguments/messages in a case
router.get("/:caseId/messages", auth, getCaseMessages);

// Fetch specific case details (guys this must come last)
router.get("/:caseId", auth, getCaseById);

export default router;
