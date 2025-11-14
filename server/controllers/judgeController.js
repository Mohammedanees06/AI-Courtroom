import { generateVerdictText } from "../services/judgeService.js";
import VerdictRun from "../models/VerdictRun.js";
import redisClient from "../config/redisClient.js";

/**
 * Generates or retrieves an AI verdict for a case.
 * Uses Redis caching to avoid unnecessary repeated AI calls.
 */
export const generateVerdict = async (req, res) => {
  try {
    const { caseId } = req.body;

    if (!caseId) {
      return res.status(400).json({ message: "Case ID is required" });
    }

    // First, check if the verdict is already available in cache
    try {
      const cachedVerdict = await redisClient.get(`verdict:${caseId}`);
      if (cachedVerdict) {
        console.log(`Served verdict from Redis cache for case: ${caseId}`);
        return res.status(200).json({
          message: "Verdict retrieved from cache",
          verdict: JSON.parse(cachedVerdict),
          cached: true,
        });
      }
    } catch (redisError) {
      console.warn("Redis error encountered, proceeding without cache:", redisError.message);
      // Cache failure should not block verdict generation
    }

    // Generate verdict using AI with retry logic handled in service
    console.log(`Generating new verdict for case: ${caseId}...`);
    const verdictText = await generateVerdictText(caseId);

    if (!verdictText || verdictText === "No verdict generated.") {
      return res.status(500).json({
        message: "AI failed to generate a valid verdict",
      });
    }

    // Save the generated verdict in the database
    try {
      await VerdictRun.create({
        caseId,
        phase: "final",
        resultJSON: {
          verdictText: verdictText,
          generatedBy: req.userId,
          timestamp: new Date(),
        },
      });
      console.log(`Verdict saved to MongoDB for case: ${caseId}`);
    } catch (dbError) {
      console.error("Failed to save verdict to MongoDB:", dbError.message);
      // Proceed even if database save fails
    }

    // Store verdict in Redis cache for 30 minutes
    try {
      await redisClient.setEx(`verdict:${caseId}`, 1800, JSON.stringify(verdictText));
      console.log(`Verdict cached in Redis for case: ${caseId}`);
    } catch (redisError) {
      console.warn("Failed to cache verdict in Redis:", redisError.message);
      // Cache failure should not affect response
    }

    // Send the newly generated verdict in response
    res.status(200).json({
      message: "Verdict generated successfully",
      verdict: verdictText,
      cached: false,
    });
  
  } catch (error) {
    console.error("Error generating verdict:", error.message);

    if (error.message.includes("Case not found")) {
      return res.status(404).json({ message: "Case not found" });
    }

    if (error.message.includes("503") || error.message.includes("overloaded")) {
      return res.status(503).json({
        message: "AI judge is temporarily busy. Please try again shortly.",
        retryable: true,
      });
    }

    if (error.message.includes("Gemini API Error")) {
      return res.status(500).json({
        message: "Failed to generate verdict. Please try again.",
        error: error.message,
      });
    }

    // Generic error handling fallback
    res.status(500).json({
      message: "An error occurred while generating verdict.",
      error: error.message,
    });
  }
};


export const getLatestVerdict = async (req, res) => {
  try {
    const { caseId } = req.params;

    // Try Redis cache first
    const cachedVerdict = await redisClient.get(`verdict:${caseId}`);
    if (cachedVerdict) {
      return res.status(200).json({ verdict: JSON.parse(cachedVerdict) });
    }

    // Fallback: get from MongoDB
    const verdictDoc = await VerdictRun.findOne({ caseId }).sort({ createdAt: -1 });
    if (verdictDoc) {
      return res.status(200).json({ verdict: verdictDoc.resultJSON.verdictText });
    }

    // If no verdict found
    return res.status(200).json({ verdict: null });
  } catch (error) {
    console.error("Error fetching verdict:", error);
    return res.status(500).json({ error: "Failed to fetch verdict" });
  }
};
