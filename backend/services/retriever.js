import { chunks } from "../chunksWithEmbeddings.js";
import { GoogleGenAI } from "@google/genai";

const cosineSimilarity = (a, b) => {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
};

export const retrieveRelevantChunks = async (query, k = 4) => {
  const genAI = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

  const result = await genAI.models.embedContent({
    model: "gemini-embedding-001",
    contents: {
      parts: [{text: query}],
    }
  });

  const queryEmbedding = result.embeddings?.[0]?.values;
  if (!queryEmbedding) {
    throw new Error("Failed to get embedding for query!");
  }

  const scored = chunks.map(chunk => ({
    ...chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, k);
};