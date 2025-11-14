import mongoose from "mongoose";

const caseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  jurisdiction: { type: String, required: true }, // e.g., "India"
  caseType: {
    type: String,
    enum: ["civil", "criminal", "contract", "tort", "ip"],
    required: true,
  },
  reliefs: {
    type: [String],
    default: [],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  currentRound: {
    type: Number,
    default: 1,
    min: 1,
    max: 5
  }
}, { timestamps: true });

export default mongoose.model("Case", caseSchema);