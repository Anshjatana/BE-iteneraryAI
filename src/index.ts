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
  origin: (
    origin: string | undefined,
    callback: (arg0: Error | null, arg1?: boolean) => void
  ) => {
    console.log(`Incoming origin: ${origin}`);

    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) {
      console.log("No origin - allowing request");
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      console.log(`Origin allowed: ${origin}`);
      callback(null, true);
    } else {
      console.log(`Blocked by CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cookie",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  credentials: true,
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
