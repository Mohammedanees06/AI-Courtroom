import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
    required: true
  },
  partyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Party",
    required: true
  },
  // partyId:
  //  { type: String, 
  //   enum: ["sideA", "sideB"], required: true },

  filename: String,
  originalName: String,
  mimeType: String,
  storagePath: String, // local or S3
  extractedText: String // parsed text for embeddings
}, { timestamps: true });

export default mongoose.model("Document", documentSchema);
