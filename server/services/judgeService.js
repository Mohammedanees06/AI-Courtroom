import Case from "../models/Case.js";
import Document from "../models/Document.js";
import Argument from "../models/Argument.js";
import { ENV } from "../config/env.js";

// Fixed helper to strip Markdown formatting
function stripMarkdown(text) {
  if (!text) return text;

  return text
    // Remove all bold/italic/underline
    .replace(/\*\*\*(.*?)\*\*\*/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    // Remove ATX headers (## Header)
    .replace(/^#{1,6}\s*/gm, '')
    // Remove unordered lists (*, -, +) with leading whitespace
    .replace(/^\s*[*+-]\s+/gm, '')
    // Remove ordered lists (1., 2., etc.) with leading whitespace
    .replace(/^\s*\d+\.\s+/gm, '')
    // Remove horizontal rules (---)
    .replace(/^---+$/gm, '')
    // Remove code blocks (``````)
    .replace(/``````/g, '')
    // Remove images ![alt](url)
    .replace(/!\[[^\]]*\]\([^\)]*\)/g, '')
    // Remove links [text](url) but keep 'text'
    .replace(/\[([^\]]*)\]\([^\)]*\)/g, '$1')
    .trim();
}


async function callGeminiWithRetry(prompt, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${ENV.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      if (response.status === 503 && attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt) * 1000;
        console.log(` Retrying in ${waitTime/1000}s... (${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API Error: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No verdict generated.";
      
      // Clean markdown before returning
      console.log("🧹 Cleaning markdown from verdict...");
      return stripMarkdown(rawText);

    } catch (error) {
      if (attempt === maxRetries) throw error;
      const waitTime = Math.pow(2, attempt) * 1000;
      console.log(` Retrying in ${waitTime/1000}s...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

export const generateVerdictText = async (caseId) => {
  const courtCase = await Case.findById(caseId);
  if (!courtCase) throw new Error("Case not found");

  const documents = await Document.find({ caseId });
  const evidenceText = documents.map(doc => doc.extractedText).join("\n\n");

  const argumentsList = await Argument.find({ caseId }).sort({ createdAt: 1 });

  const sideAArguments = argumentsList
    .filter(a => a.side === "A")
    .map((a, i) => `${i + 1}. [Round ${a.round}] ${a.content}`)
    .join("\n");

  const sideBArguments = argumentsList
    .filter(a => a.side === "B")
    .map((a, i) => `${i + 1}. [Round ${a.round}] ${a.content}`)
    .join("\n");

  const prompt = `
You are an experienced appellate judge tasked with rendering a fair and balanced verdict based on legal principles.

═══════════════════════════════════════════════════════════
CASE INFORMATION
═══════════════════════════════════════════════════════════
Case Title: ${courtCase.title}
Case Type: ${courtCase.caseType}
Jurisdiction: ${courtCase.jurisdiction}

═══════════════════════════════════════════════════════════
DOCUMENTARY EVIDENCE SUBMITTED
═══════════════════════════════════════════════════════════
${evidenceText || "No documentary evidence was submitted by either party."}

═══════════════════════════════════════════════════════════
ARGUMENTS PRESENTED
═══════════════════════════════════════════════════════════

SIDE A (PLAINTIFF) ARGUMENTS:
${sideAArguments || "No arguments submitted."}

SIDE B (DEFENDANT) ARGUMENTS:
${sideBArguments || "No arguments submitted."}

═══════════════════════════════════════════════════════════
INSTRUCTIONS FOR VERDICT
═══════════════════════════════════════════════════════════

Please provide a comprehensive legal analysis using the IRAC method:

1. ISSUE: Clearly identify the primary legal issue(s) in dispute.

2. RULE: State the applicable legal rules, statutes, or precedents relevant to this ${courtCase.caseType} case under ${courtCase.jurisdiction} jurisdiction.

3. APPLICATION: 
   - Analyze Side A's strongest arguments and supporting evidence
   - Analyze Side B's strongest arguments and supporting evidence
   - Compare the legal merit and evidentiary support of both positions
   - Address any weaknesses or gaps in each party's case

4. CONCLUSION: 
   - Render a clear verdict in favor of Side A or Side B
   - Provide specific legal reasoning for your decision
   - If applicable, suggest remedies or next steps

Maintain judicial neutrality and base your verdict solely on the arguments and evidence presented.
`;

  return await callGeminiWithRetry(prompt, 3);
};
