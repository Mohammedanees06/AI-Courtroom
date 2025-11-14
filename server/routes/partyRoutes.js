import express from "express";
import {
  assignUserToCase,
  listPartiesForCase,
  getPartyByCase,
} from "../controllers/partyController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

/**
 *  PARTY ROUTES — 
 * Always define specific/static routes BEFORE dynamic ones (like /case/:caseId)
 */

// assign a user to a case (Admin / internal use)
router.post("/assign", auth, assignUserToCase);

// List all parties in a given case (?caseId=xyz)
router.get("/", auth, listPartiesForCase);

//  Get the logged-in user's role in a specific case (Side A/B)
router.get("/case/:caseId", auth, getPartyByCase);

export default router;
