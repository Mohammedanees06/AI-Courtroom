import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { ENV } from "./config/env.js";
import { logger } from "./config/logger.js";
// Routes
import authRoutes from "./routes/authRoutes.js";
import caseRoutes from "./routes/caseRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import judgeRoutes from "./routes/judgeRoutes.js";
import argumentRoutes from "./routes/argumentRoutes.js";
import partyRoutes from "./routes/partyRoutes.js";



connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/judge", judgeRoutes);
app.use("/api/arguments", argumentRoutes);
app.use("/api/parties", partyRoutes);


// Test Route
app.get("/", (req, res) => {
  res.send("AI Judge Server is Running ");
});

// Server Listen
app.listen(ENV.PORT, () => {
    logger.info(`Server running at http://localhost:${ENV.PORT}`);


});