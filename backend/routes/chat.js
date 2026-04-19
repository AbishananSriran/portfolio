import express from "express";
import { generateResponse } from "../services/ai.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    const reply = await generateResponse(message);

    res.json({ reply });
  } catch (err) {
    console.error("Error in chat route:", err);
    res.status(500).json({ error: "Chat failed" });
  }
});

export default router;