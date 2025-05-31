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
  "https://itinerary.anshjatana.online/", // Try with trailing slash too
];

// CORS options
const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (arg0: Error | null, arg1?: boolean) => void,
    req?: express.Request
  ) => {
    console.log(`Incoming origin: ${origin}`); // Debugging CORS issues
    console.log(
      `User-Agent: ${req?.headers?.["user-agent"] || "Not available"}`
    ); // Additional debugging

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
      console.log(`Allowed origins: ${allowedOrigins.join(", ")}`);
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
    "User-Agent",
    "DNT",
    "Cache-Control",
    "X-Mx-ReqToken",
    "Keep-Alive",
    "If-Modified-Since",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Add explicit preflight handling
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(cors(corsOptions));

// Add a test endpoint to verify CORS
app.get("/api/test-cors", (req, res) => {
  res.json({
    message: "CORS is working!",
    origin: req.headers.origin,
    userAgent: req.headers["user-agent"],
  });
});

app.use("/api/itineraries", itineraryRoutes);

connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
