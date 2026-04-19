  import express from "express";
  import { sendEmail } from "../services/email.js";

  const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
  const router = express.Router();

  router.post("/", async (req, res) => {

    const { name, email, message, recaptchaToken } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    const RECAPTCHA_SECRET_KEY = process.env.NODE_ENV === "production"
    ? process.env.RECAPTCHA_SECRET_KEY
    : process.env.RECAPTCHA_TEST_SECRET_KEY;

    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET_KEY, 
        response: recaptchaToken,
      }),
    });

    const data = await response.json();
    if (!data.success) {
      return res.status(400).json({ error: "reCAPTCHA failed" });
    }

    try {
      const responseEmail = await sendEmail({ name, email, message });
      if (!responseEmail || !responseEmail.data.id || responseEmail.error) {
          console.error("Invalid response from email service:", responseEmail);
          return res.status(500).json({ error: "Email service error" });
      }

      res.status(200).json({ success: true, id: responseEmail.data.id });
    } catch (error) {
      console.error("Email error:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  export default router;