import mongoose from "mongoose";

const argumentSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
    required: true
  },
  side: {
    type: String,
    enum: ["A", "B"],
    required: true
  },
  round: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Argument", argumentSchema);
