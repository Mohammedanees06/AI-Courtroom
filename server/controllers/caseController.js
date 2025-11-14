import { createNewCase, getCasesByUser, getCaseByIdService, joinCaseService} from "../services/caseService.js";
import Argument from "../models/Argument.js";
import Case from "../models/Case.js";
import redisClient from "../config/redisClient.js"; 
import Party from "../models/Party.js";

/**
 * Creates a new case with the provided details.
 */
export const createCase = async (req, res) => {
  try {
    const { title, jurisdiction, caseType, reliefs } = req.body;

    const newCase = await createNewCase({
      title,
      jurisdiction,
      caseType,
      reliefs,
      userId: req.userId
    });

    res.status(201).json({
      message: "Case created successfully",
      caseId: newCase._id,
      case: newCase
    });
  } catch (error) {
    console.error("Case Create Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieves paginated list of all cases created by the logged-in user.
 */
export const getUserCases = async (req, res) => {
  try {
    const userId = req.userId;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalCount = await Case.countDocuments({ createdBy: userId });

    const userCases = await Case.find({ createdBy: userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      cases: userCases,
      totalPages,
    });

  } catch (error) {
    console.error("Get Cases Error:", error.message);
    res.status(500).json({ message: "Couldn't fetch cases" });
  }
};

/**
 * Fetches case details by case ID with Redis caching for performance.
 */
export const getCaseById = async (req, res) => {
  try {
    const { caseId } = req.params;

    // Check if the case is cached in Redis
    const cachedCase = await redisClient.get(`case:${caseId}`);

    if (cachedCase) {
      console.log("Served case details from Redis cache");
      return res.status(200).json(JSON.parse(cachedCase));
    }

    // Fetch case from MongoDB if not cached
    const caseData = await Case.findById(caseId);
    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    // Prepare safe response to avoid sensitive data exposure
    const safeCase = {
      _id: caseData._id,
      title: caseData.title,
      jurisdiction: caseData.jurisdiction,
      caseType: caseData.caseType,
      reliefs: caseData.reliefs,
      createdBy: caseData.createdBy,
      createdAt: caseData.createdAt,
    };

    let fullCase = null;
    try {
      fullCase = await getCaseByIdService(caseId, req.userId);
    } catch {
      fullCase = null; // Fallback if service fails
    }

    const responseData = fullCase || safeCase;

    // Cache the response in Redis for 10 minutes
    await redisClient.setEx(`case:${caseId}`, 600, JSON.stringify(responseData));

    console.log("Stored case details in Redis cache");

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Get Case By ID Error:", error.message);
    res.status(500).json({ message: "Couldn't fetch case details" });
  }
};

/**
 * Handles a user joining a case as either side A or side B.
 * Clears the Redis cache for case details upon update.
 */
export const joinCase = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { side } = req.body;
    const userId = req.userId;

    if (!side || !["A", "B"].includes(side)) {
      return res.status(400).json({ message: "Invalid side. Must be 'A' or 'B'." });
    }

    const result = await joinCaseService({ caseId, userId, side });

    // Clear Redis cache to reflect the updated case participation
    await redisClient.del(`case:${caseId}`);

    res.status(200).json({
      message: result.message,
      side: result.party.side,
      partyId: result.party._id,
      caseId: result.party.caseId,
      name: result.party.name,
    });
  } catch (error) {
    console.error("Join Case Error:", error.message);
    res.status(400).json({ message: error.message || "Failed to join case" });
  }
};

/**
 * Retrieves chat messages for a case along with round info,
 * leveraging Redis caching for improved response times.
 */
export const getCaseMessages = async (req, res) => {
  try {
    const { caseId } = req.params;

    // Check for cached messages in Redis
    const cachedData = await redisClient.get(`messages:${caseId}`);

    if (cachedData) {
      console.log("Served messages from Redis cache");
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Retrieve case document to get current round info
    const caseDoc = await Case.findById(caseId);
    if (!caseDoc) {
      return res.status(404).json({ message: "Case not found" });
    }

    // Query messages sorted by creation time
    const messages = await Argument.find({ caseId })
      .sort({ createdAt: 1 })
      .select("side content round createdAt");

    const responseData = {
      messages,
      currentRound: caseDoc.currentRound || 1,
    };

    // Cache messages with a short TTL of 30 seconds
    await redisClient.setEx(`messages:${caseId}`, 30, JSON.stringify(responseData));

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ message: error.message });
  }
};
