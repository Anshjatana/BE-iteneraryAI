import express from 'express';
import Itinerary  from '../models/Itinerary';
import { GeminiService } from '../services/gemini.service';

const router = express.Router();
const geminiService = new GeminiService();

// Create new itinerary with recommendations from Gemini service
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      destination,
      placeId,
      startDate,
      endDate,
      travelGroup,
      interests,
      budget,
    } = req.body;

    // Validate required fields
    if (!userId || !destination || !placeId || !startDate || !endDate || !interests || !budget) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate itinerary recommendations using Gemini service
    const duration = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24));

    const recommendations = await geminiService.generateItineraryRecommendations({
      destination,
      duration,
      interests,
    });
    console.log('Recommendations:', recommendations); // Log the response

    // Create new itinerary
    const itinerary = new Itinerary({
      userId,
      destination,
      placeId,
      startDate,
      endDate,
      travelGroup,
      interests,
      budget,
      recommendations,
    });

    await itinerary.save();
    res.status(201).json(itinerary);
  } catch (error) {
    console.error('Error creating itinerary:', error);
    res.status(500).json({ error: 'Failed to create itinerary' });
  }
});

// Get user's itineraries
router.get('/user/:userId', async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ userId: req.params.userId });
    res.json(itineraries);
  } catch (error) {
    console.error('Error fetching user itineraries:', error);
    res.status(500).json({ error: 'Failed to fetch itineraries' });
  }
});

// Get single itinerary
router.get('/:id', async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }
    res.json(itinerary);
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    res.status(500).json({ error: 'Failed to fetch itinerary' });
  }
});

// Update itinerary
router.put('/:id', async (req, res) => {
  try {
    const { destination, placeId, startDate, endDate, interests, budget } = req.body;

    // Validate required fields for update
    if (!destination || !placeId || !startDate || !endDate || !interests || !budget) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const itinerary = await Itinerary.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

    if (!itinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }

    res.json(itinerary);
  } catch (error) {
    console.error('Error updating itinerary:', error);
    res.status(500).json({ error: 'Failed to update itinerary' });
  }
});

// Delete itinerary
router.delete('/:id', async (req, res) => {
  try {
    const itinerary = await Itinerary.findByIdAndDelete(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }
    res.json({ message: 'Itinerary deleted successfully' });
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    res.status(500).json({ error: 'Failed to delete itinerary' });
  }
});

export { router as itineraryRoutes };
