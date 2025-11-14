import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  REDIS_URL: process.env.REDIS_URL, 
};
