import mongoose from "mongoose";

const verdictRunSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
    required: true
  },
  phase: {
    type: String,
    enum: ["initial", "round1", "round2", "round3", "round4", "round5", "final"],
    required: true
  },
  resultJSON: {
    type: Object,
    required: true
  },
  // Add these fields if you want them separate
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  verdictText: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model("VerdictRun", verdictRunSchema);
