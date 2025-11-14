import { submitArgumentService } from "../services/argumentService.js";
import redisClient from "../config/redisClient.js"; 

export const submitArgument = async (req, res) => {
  try {
    const { caseId, side, text } = req.body;

    // Validate required fields
    if (!caseId || !text || !side) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Call service to save argument
    const result = await submitArgumentService({
      caseId,
      userId: req.userId,
      side,
      content: text,
    });

    // Clear Redis cache for messages related to this case
    await redisClient.del(`messages:${caseId}`);

    // Respond with success data
    res.status(201).json({
      message: `Argument recorded for Side ${result.newArgument.side} `,
      round: result.round,
      remainingRounds: result.remainingRounds,
      argument: result.newArgument,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
