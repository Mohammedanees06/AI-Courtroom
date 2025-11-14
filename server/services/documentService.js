import fs from "fs";
import mammoth from "mammoth";
const pdfParse = (await import("pdf-parse")).default;
import Document from "../models/Document.js";
import { chunkText } from "../utils/chunkText.js";

 
export const processAndStoreDocument = async ({ caseId, partyId, file }) => {
  const filePath = file.path;
  const mimeType = file.mimetype;
  let extractedText = "";

  // Extract text depending on type
  if (mimeType === "application/pdf") {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    extractedText = pdfData.text;
  } else if (
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ path: filePath });
    extractedText = result.value;
  } else {
    extractedText = fs.readFileSync(filePath, "utf8");
  }

  // Optional: Create chunks (better AI results later)
  const chunks = chunkText(extractedText, 1500);

  // Store document
  const doc = await Document.create({
    caseId,
    partyId,
    filename: file.filename,
    originalName: file.originalname,
    mimeType,
    storagePath: filePath,
    extractedText,
    chunks // optional
  });

  return doc;
};
