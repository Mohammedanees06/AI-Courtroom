import Party from "../models/Party.js";
import mongoose from "mongoose";

/**
 * Assign a user to a case manually (for admin or internal system usage).
 */
export const assignUserToCase = async (req, res) => {
  try {
    const { caseId, userId, side, name } = req.body;

    // Validate required fields
    if (!caseId || !userId || !side) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (!["A", "B"].includes(side)) {
      return res.status(400).json({ message: "Side must be 'A' or 'B'" });
    }

    // Prevent user from being assigned to the same case multiple times
    const existing = await Party.findOne({ caseId, userId });
    if (existing) {
      return res.status(400).json({ message: "User already assigned to this case" });
    }

    // Ensure only one user per side per case
    const sideTaken = await Party.findOne({ caseId, side });
    if (sideTaken) {
      return res.status(400).json({ message: `Side ${side} is already taken` });
    }

    // Create a new party entry
    const party = await Party.create({
      caseId,
      userId,
      side,
      name: name || "Anonymous",
    });

    res.status(201).json({
      message: "User assigned to case successfully",
      party,
    });
  } catch (error) {
    console.error("Assign User Error:", error);
    res.status(400).json({ message: error.message });
  }
};

/**
 * List all parties associated with a specific case.
 * Provides side occupancy summary to identify taken sides.
 */
export const listPartiesForCase = async (req, res) => {
  try {
    const { caseId } = req.query;

    if (!caseId) {
      return res.status(400).json({ message: "caseId is required" });
    }

    const parties = await Party.find({ caseId }).select("side name userId");

    // Summarize sides that are occupied
    const sidesTaken = {
      A: parties.some((p) => p.side === "A"),
      B: parties.some((p) => p.side === "B"),
    };

    res.status(200).json({ parties, sidesTaken });
  } catch (error) {
    console.error("List Parties Error:", error);
    res.status(400).json({ message: error.message });
  }
};

/**
 * Get the logged-in user's participation details for a specific case.
 */
export const getPartyByCase = async (req, res) => {
  try {
    const { caseId } = req.params;
    const userId = req.userId;

    // Validate caseId format to prevent invalid queries
    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      return res.status(400).json({ message: "Invalid Case ID format" });
    }

    // Find the user's party record for the specified case
    const party = await Party.findOne({ caseId, userId });

    // If user has not joined the case, respond with 404 for frontend handling
    if (!party) {
      return res.status(404).json({ message: "Not yet joined" });
    }

    // Return party details including assigned side
    res.status(200).json({
      _id: party._id,
      caseId: party.caseId,
      userId: party.userId,
      side: party.side,
      name: party.name,
    });
  } catch (error) {
    console.error("Get Party Error:", error);
    res.status(500).json({ message: "Error fetching party information" });
  }
};
