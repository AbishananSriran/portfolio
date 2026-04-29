import { GoogleGenAI } from "@google/genai";
import { retrieveRelevantChunks } from "./retriever.js";

export const generateResponse = async (message) => {
  const genAI = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

  const relevantChunks = await retrieveRelevantChunks(message);
  const context = relevantChunks
    .map(chunk => chunk.text)
    .join("\n\n---\n\n");

  if (relevantChunks.length === 0) {
    return "I don't have enough information to answer that.";
  }

  const prompt = `
You are an AI assistant answering questions about Abishanan. 
Answer using only the provided context. If unknown, say I don't know.

If using bullet points, format with dashes and use line breaks. No markdown formatting.

Context:
${context}

User question:
${message}
`;

  const response = await genAI.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      temperature: 0.2,
    },
  });

  return response.text;
};