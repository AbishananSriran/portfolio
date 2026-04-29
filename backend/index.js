import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import contactRoute from "./routes/contact.js";
import chatRoute from "./routes/chat.js";
import serverless from "serverless-http";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/contact", contactRoute);
app.use("/api/chat", chatRoute);

app.get("/", (req, res) => {
  res.send("API running");
});

if (process.env.NODE_ENV !== "production") {
  app.listen(3001, () => {
    console.log("Server running on port 3001");
  });
}

export const handler = serverless(app);