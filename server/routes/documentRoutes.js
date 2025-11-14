import express from "express";
import { upload } from "../middleware/upload.js";
import { uploadDocument, deleteDocument } from "../controllers/documentController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/upload", auth, upload.single("file"), uploadDocument);
router.delete("/:id", deleteDocument);

export default router;
