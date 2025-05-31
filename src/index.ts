import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { itineraryRoutes } from "./routes/itinerary.routes";
import { connectDB } from "./config/db";

const app = express();

dotenv.config();

// Define the allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://itinerary.anshjatana.online",
];

// CORS options
const corsOptions = {
  origin: true, // Allow all origins
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["*"],
  optionsSuccessStatus: 200,
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Routes
app.use("/api/itineraries", itineraryRoutes);

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({
    message: "API is working!",
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
  });
});

connectDB();

// For Vercel serverless functions
if (process.env.VERCEL) {
  module.exports = app;
} else {
  // For local development
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
