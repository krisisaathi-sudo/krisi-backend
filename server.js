// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Import dependencies
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";

// Import routes
import detectRoutes from "./routes/detectRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";

// Initialize app
const app = express();

// ✅ Middleware (IMPORTANT: Order matters!)
app.use(cors({
  origin: ["https://krisisaathi.netlify.app/"],
  credentials: true,
}));
app.use(express.json()); // Required for parsing JSON body

// ✅ Routes
app.use("/detect", detectRoutes);
app.use("/chat", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes); // Add if using profile route

// ✅MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(" MongoDB connected"))
.catch((err) => console.error(" MongoDB error:", err));

// Multer setup for uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.post("/upload-profile", upload.single("profile"), (req, res) => {
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

app.use("/uploads", express.static("uploads"));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
);
