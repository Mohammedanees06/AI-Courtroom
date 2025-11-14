import mongoose from "mongoose";
import { ENV } from "./env.js";
import { logger } from "./logger.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI, { dbName: "AI_Judge" });
    logger.info("MongoDB Connected ");
  } catch (err) {
    logger.error("MongoDB Failed  " + err.message);
    process.exit(1);
  }
};