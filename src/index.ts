import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { itineraryRoutes } from './routes/itinerary.routes';
import { aiRoutes } from './routes/ai.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// ✅ Update CORS policy
app.use(cors({
  origin: 'https://itinerary.anshjatana.online',  // ✅ Allow frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,  // ✅ Allow cookies and auth headers
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/ai', aiRoutes);

// Connect to MongoDB
connectDB();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
