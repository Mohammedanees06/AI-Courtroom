import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
    required: true
  },
  partyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false 
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  storagePath: {
    type: String,
    required: true
  },
  extractedText: {
    type: String,
    required: false,
    default: ""
  },
  chunks: {
    type: [String],  // Stores processed text chunks for AI
    default: []
  }
}, { timestamps: true });

export default mongoose.model("Document", documentSchema);
