import express from 'express';
import { GeminiService } from '../services/gemini.service';

const router = express.Router();
const geminiService = new GeminiService();

// Endpoint to generate itinerary recommendations
router.post('/recommendations', async (req, res) => {
  try {
    const { destination, duration, interests } = req.body;

    // Validate input parameters
    if (!destination || !duration || !Array.isArray(interests) || interests.length === 0) {
      return res.status(400).json({ error: 'Invalid input parameters' });
    }

    const recommendations = await geminiService.generateItineraryRecommendations({
      destination,
      duration,
      interests
    });

    res.json(recommendations);
  } catch (error) {
    console.error('Error generating itinerary recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// Endpoint to get insights for a place
router.get('/insights/:placeName/:placeType', async (req, res) => {
  try {
    const { placeName, placeType } = req.params;

    // Validate input parameters
    if (!placeName || !placeType) {
      return res.status(400).json({ error: 'Place name and type are required' });
    }

    const insights = await geminiService.getPlaceInsights(placeName, placeType);
    res.json(insights);
  } catch (error) {
    console.error('Error getting place insights:', error);
    res.status(500).json({ error: 'Failed to get place insights' });
  }
});

export { router as aiRoutes };
