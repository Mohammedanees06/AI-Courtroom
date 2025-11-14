import VerdictRun from "../models/VerdictRun.js";

export const storeVerdict = async (caseId, userId, text) => {
  return await VerdictRun.create({
    caseId,
    generatedBy: userId,
    verdictText: text
  });
};
