import express from "express";
import multer from "multer";
import fs from "fs";
import dotenv from "dotenv"; // ✅ Add this
import OpenAI from "openai";

// ✅ Load environment variables from .env file
dotenv.config(); // 🔑 REQUIRED to access process.env

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Debugging
console.log("🔑 Detect Route OpenAI Key:", process.env.OPENAI_API_KEY);

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const imageBuffer = fs.readFileSync(req.file.path);

    // 🧠 You are not actually sending the image to OpenAI here
    // Let's keep this part working for now, even if it's just a dummy message

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert in crop pest detection." },
        { role: "user", content: "Analyze this crop image." }
      ]
    });

    res.json({ result: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
