import mongoose from "mongoose";

const citationSchema = new mongoose.Schema({
  verdictRunId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VerdictRun",
    required: true
  },
  sourceType: {
    type: String,
    enum: ["uploaded", "precedent"],
    required: true
  },
  sourceRef: String,     // docId#chunk OR legal citation code
  quote: String         
}, { timestamps: true });

export default mongoose.model("Citation", citationSchema);
