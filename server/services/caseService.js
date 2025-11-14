import Case from "../models/Case.js";
import Party from "../models/Party.js";
import User from "../models/User.js";

/**
 * Creates a new case and associates it with the user who created it.
 */
export const createNewCase = async ({ title, jurisdiction, caseType, reliefs, userId }) => {
  if (!title || !jurisdiction || !caseType) {
    throw new Error("Missing required fields");
  }

  const newCase = await Case.create({
    title,
    jurisdiction,
    caseType,
    reliefs: reliefs || [],
    createdBy: userId,
  });

  return newCase;
};

/**
 * Retrieves all cases created by the specified user, ordered by creation date.
 */
export const getCasesByUser = async (userId) => {
  return await Case.find({ createdBy: userId }).sort({ createdAt: -1 });
};

/**
 * Retrieves a single case by ID.
 * Throws if the case is not found.
 */
export const getCaseByIdService = async (caseId) => {
  const caseData = await Case.findById(caseId);
  if (!caseData) throw new Error("Case not found");
  return caseData;
};

/**
 * Allows a user to join a case as Side A or Side B.
 * Performs validation on case existence, user participation, and side availability.
 */
export const joinCaseService = async ({ caseId, userId, side }) => {
  // Check that the case exists
  const caseExists = await Case.findById(caseId);
  if (!caseExists) {
    throw new Error("Case not found");
  }

  // Check if user is already a participant in this case
  const existingParty = await Party.findOne({ caseId, userId });
  if (existingParty) {
    throw new Error(`You already joined this case as Side ${existingParty.side}`);
  }

  // Ensure the case does not already have two participants
  const currentParties = await Party.find({ caseId });
  if (currentParties.length >= 2) {
    throw new Error("Both sides are already occupied. No more participants can join this case.");
  }

  // Verify the requested side is available
  const sideTaken = await Party.findOne({ caseId, side });
  if (sideTaken) {
    throw new Error(`Side ${side} is already taken. Please join as the opposite side.`);
  }

  // Validate the user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Create a new participant record
  const party = await Party.create({
    caseId,
    userId,
    side,
    name: user.name || user.username || user.email || "Anonymous",
  });

  // Return a structured response
  return {
    success: true,
    message: `Joined case successfully as Side ${side}`,
    party,
  };
};
