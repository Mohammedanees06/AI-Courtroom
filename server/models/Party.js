import mongoose from "mongoose";

const partySchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  side: {
    type: String,
    enum: ["A", "B"],
    required: true,
  },
  name: {
    type: String,
    required: true,
  }
}, { timestamps: true });

export default mongoose.model("Party", partySchema);