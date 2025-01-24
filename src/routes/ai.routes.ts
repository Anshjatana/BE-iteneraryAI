import express from 'express';
import { GeminiService } from '../services/gemini.service';

const router = express.Router();
const geminiService = new GeminiService();

// Endpoint to generate itinerary recommendations
router.post('/recommendations', async (req, res) => {
  try {
    const { destination, duration, interests, budget } = req.body;

    // Validate input parameters
    if (!destination || !duration || !Array.isArray(interests) || interests.length === 0) {
      return res.status(400).json({ error: 'Invalid input parameters' });
    }

    const recommendations = await geminiService.generateItineraryRecommendations({
      destination,
      duration,
      interests,
      budget
    });

    res.json(recommendations);
  } catch (error) {
    console.error('Error generating itinerary recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

export { router as aiRoutes };
