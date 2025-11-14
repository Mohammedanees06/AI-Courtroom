import Argument from "../models/Argument.js";
import Party from "../models/Party.js";
import Case from "../models/Case.js";
import redisClient from "../config/redisClient.js";

export const submitArgumentService = async ({ caseId, userId, side, content }) => {
  console.log("Submitting argument with details:", { caseId, userId, side, content });

  // Verify the user is assigned to this case
  const party = await Party.findOne({ caseId, userId });
  if (!party) throw new Error("User is not assigned to this case");

  // Always trust the side saved in the database, ignore frontend input
  const actualSide = party.side;
  console.log("Using side from database:", actualSide);

  // Get the case document and check if it exists
  const caseDoc = await Case.findById(caseId);
  if (!caseDoc) throw new Error("Case not found");

  // Initialize current round if missing
  if (!caseDoc.currentRound) {
    caseDoc.currentRound = 1;
    await caseDoc.save();
  }
  const currentRound = caseDoc.currentRound;

  // Check if the case has already reached the maximum number of rounds
  if (currentRound > 5) {
    throw new Error("Case has ended. Maximum of 5 rounds completed.");
  }

  // Count how many arguments this side has submitted in the current round
  const argumentsThisRound = await Argument.countDocuments({
    caseId,
    side: actualSide,
    round: currentRound,
  });
  console.log(`Side ${actualSide} has submitted ${argumentsThisRound} of 2 allowed arguments in round ${currentRound}`);

  // Prevent submitting more than 2 arguments per side per round
  if (argumentsThisRound >= 2) {
    throw new Error(`Side ${actualSide} has already submitted 2 arguments for round ${currentRound}`);
  }

  // Create and save the new argument with the current round number
  const newArgument = await Argument.create({
    caseId,
    userId,
    side: actualSide,
    round: currentRound,
    content,
  });

  // Count number of arguments per side to determine if the round can advance
  const sideACount = await Argument.countDocuments({ caseId, side: "A", round: currentRound });
  const sideBCount = await Argument.countDocuments({ caseId, side: "B", round: currentRound });

  // Automatically advance the round if both sides have submitted the required number of arguments
  if (sideACount >= 2 && sideBCount >= 2 && currentRound < 5) {
    caseDoc.currentRound = currentRound + 1;
    await caseDoc.save();
    console.log(`Round ${currentRound} completed. Advancing to round ${currentRound + 1}.`);
  }

  // Clear Redis cache for messages to ensure frontend receives updated data
  await redisClient.del(`messages:${caseId}`);

  return {
    newArgument,
    round: currentRound,
    remainingInRound: 2 - (argumentsThisRound + 1),
    totalRounds: 5,
  };
};
