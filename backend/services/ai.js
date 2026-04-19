// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { retrieveRelevantChunks } from "./retriever.js";

// let model = null;

export const generateResponse = async (message) => {
//   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//   if (!model)
//     model = genAI.getGenerativeModel({
//       model: "gemini-1.5-flash",
//       generationConfig: {
//         temperature: 0.2,
//       },
//     });

//   const relevantChunks = await retrieveRelevantChunks(message);
//   const context = relevantChunks
//     .map(chunk => chunk.text)
//     .join("\n\n---\n\n");

//   const prompt = `
// You are an AI assistant answering questions about Abishanan.
// Only use the context below. If the answer is not in the context, say you don't know.

// Context:
// ${context}

// User question:
// ${message}
// `;

//   const result = await model.generateContent(prompt);
//   const response = await result.response;

//   return response.text();
  return "This is a WIP 🚧 Please try again later."
};