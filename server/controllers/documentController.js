import { processAndStoreDocument } from "../services/documentService.js";
import Document from "../models/Document.js";
import fs from "fs";
import redisClient from "../config/redisClient.js"; // Assuming redisClient is needed here too

export const uploadDocument = async (req, res) => {
  try {
    const { caseId, partyId } = req.body;

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Process the uploaded file and store metadata
    const doc = await processAndStoreDocument({ caseId, partyId, file: req.file });

    // Clear document cache for the associated case to ensure fresh data
    await redisClient.del(`docs:${caseId}`);

    res.status(201).json({
      message: "Document uploaded successfully",
      document: doc,
    });
  } catch (error) {
    console.error("Upload error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the document record in the database
    const doc = await Document.findById(id);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Remove the physical file from storage if it exists
    if (fs.existsSync(doc.storagePath)) {
      fs.unlinkSync(doc.storagePath);
    }

    // Delete the document record from the database
    await Document.findByIdAndDelete(id);

    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Delete Document Error:", error);
    res.status(500).json({ message: "Server error occurred while deleting document" });
  }
};
