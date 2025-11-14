import express from "express";
import { generateVerdict , getLatestVerdict} from "../controllers/judgeController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/verdict", auth, generateVerdict);
//  GET endpoint to fetch latest verdict for polling
router.get("/verdict/:caseId", auth, getLatestVerdict);

export default router;
