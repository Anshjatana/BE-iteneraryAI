import express from 'express';
import cors from 'cors';
import { aiRoutes } from './routes/ai.routes.js';
import { itineraryRoutes } from './routes/itinerary.routes.js';

const app = express();

// Define the allowed origins
const allowedOrigins = ['http://localhost:3000', 'https://itinerary.anshjatana.online'];

// CORS options
const corsOptions = {
  origin: (origin: string | undefined, callback: (arg0: Error | null, arg1: boolean | undefined) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  methods: 'GET, POST, PUT, DELETE, OPTIONS',
  allowedHeaders: 'Content-Type, Authorization , Cookie',
  credentials: true, // Allow cookies/credentials
  preflightContinue: true, // Automatically handle preflight requests
};

// Use CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests manually (for strict CORS policies)
app.options('*', cors(corsOptions));

app.use('/api/itineraries', itineraryRoutes);
app.use('/api/ai', aiRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
