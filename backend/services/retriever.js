import { chunks } from "../chunks.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

let embedModel = null;

const cosineSimilarity = (a, b) => {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
};

export const retrieveRelevantChunks = async (query, k = 4) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log(embedModel)

  if (!embedModel)
    embedModel = genAI.getGenerativeModel({
        model: "gemini-embedding-001",
    });


  const result = await embedModel.embedContent(query);
  const queryEmbedding = result.embedding.values;

  const scored = chunks.map(chunk => ({
    ...chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, k);
};