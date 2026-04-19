import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import contactRoute from "./routes/contact.js";
import chatRoute from "./routes/chat.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/contact", contactRoute);
app.use("/api/chat", chatRoute);

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});