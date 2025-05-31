import express from "express";
import dotenv from "dotenv";
import { itineraryRoutes } from "./routes/itinerary.routes";
import { connectDB } from "./config/db";

const app = express();
dotenv.config();

// NUCLEAR CORS FIX - This handles everything
app.use((req, res, next) => {
  // Allow all origins
  res.header("Access-Control-Allow-Origin", "*");

  // Allow all methods
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );

  // Allow all headers
  res.header("Access-Control-Allow-Headers", "*");

  // Allow credentials
  res.header("Access-Control-Allow-Credentials", "true");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  next();
});

// Body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "CORS is working!",
    origin: req.headers.origin,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/itineraries", itineraryRoutes);

// Catch all handler
app.get("*", (req, res) => {
  res.json({ message: "API is running", path: req.path });
});

// Connect to database
connectDB();

// Export for Vercel
export default app;
