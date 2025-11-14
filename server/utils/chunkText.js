export const chunkText = (text, chunkSize = 1500) => {
  if (!text || typeof text !== "string") return [];

  // Clean extra whitespace
  text = text.replace(/\s+/g, " ").trim();

  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.substring(i, i + chunkSize));
  }

  return chunks;
};
