import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { itineraryRoutes } from './routes/itinerary.routes';
import { aiRoutes } from './routes/ai.routes';
import { connectDB } from './config/db';

const app = express();

dotenv.config();

// Define the allowed origins
const allowedOrigins = ['http://localhost:3000/', 'https://itinerary.anshjatana.online/'];

// CORS options
const corsOptions = {
  origin: (origin: string | undefined, callback: (arg0: Error | null, arg1: boolean | undefined) => void) => {
    console.log(`Incoming origin: ${origin}`); // Debugging CORS issues
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`Blocked by CORS: ${origin}`); // Debugging CORS issues
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  credentials: true,
  optionsSuccessStatus: 200, // Ensure the OPTIONS response is OK
};

app.use(express.json());

app.use(cors(corsOptions));
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/ai', aiRoutes);

connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
