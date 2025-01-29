"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.itineraryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const Itinerary_1 = __importDefault(require("../models/Itinerary"));
const gemini_service_1 = require("../services/gemini.service");
const router = express_1.default.Router();
exports.itineraryRoutes = router;
const geminiService = new gemini_service_1.GeminiService();
// Create new itinerary with recommendations from Gemini service
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, destination, placeId, numberOfDays, travelGroup, interests, budget, } = req.body;
        // Validate required fields
        if (!userId || !destination || !placeId || !numberOfDays || !interests || !budget) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        // Generate itinerary recommendations using Gemini service
        const recommendations = yield geminiService.generateItineraryRecommendations({
            destination,
            duration: numberOfDays,
            interests,
            budget,
        });
        console.log('Recommendations:', recommendations); // Log the response
        // Create new itinerary
        const itinerary = new Itinerary_1.default({
            userId,
            destination,
            placeId,
            numberOfDays,
            travelGroup,
            interests,
            budget,
            recommendations,
        });
        yield itinerary.save();
        res.status(201).json(itinerary);
    }
    catch (error) {
        console.error('Error creating itinerary:', error);
        res.status(500).json({ error: 'Failed to create itinerary' });
    }
}));
// Get user's itineraries
router.get('/user/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const itineraries = yield Itinerary_1.default.find({ userId: req.params.userId });
        res.json(itineraries);
    }
    catch (error) {
        console.error('Error fetching user itineraries:', error);
        res.status(500).json({ error: 'Failed to fetch itineraries' });
    }
}));
// Get single itinerary
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const itinerary = yield Itinerary_1.default.findById(req.params.id);
        if (!itinerary) {
            return res.status(404).json({ error: 'Itinerary not found' });
        }
        res.json(itinerary);
    }
    catch (error) {
        console.error('Error fetching itinerary:', error);
        res.status(500).json({ error: 'Failed to fetch itinerary' });
    }
}));
// Update itinerary
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { destination, placeId, startDate, endDate, interests, budget } = req.body;
        // Validate required fields for update
        if (!destination || !placeId || !startDate || !endDate || !interests || !budget) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const itinerary = yield Itinerary_1.default.findByIdAndUpdate(req.params.id, Object.assign(Object.assign({}, req.body), { updatedAt: new Date() }), { new: true });
        if (!itinerary) {
            return res.status(404).json({ error: 'Itinerary not found' });
        }
        res.json(itinerary);
    }
    catch (error) {
        console.error('Error updating itinerary:', error);
        res.status(500).json({ error: 'Failed to update itinerary' });
    }
}));
// Delete itinerary
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const itinerary = yield Itinerary_1.default.findByIdAndDelete(req.params.id);
        if (!itinerary) {
            return res.status(404).json({ error: 'Itinerary not found' });
        }
        res.json({ message: 'Itinerary deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting itinerary:', error);
        res.status(500).json({ error: 'Failed to delete itinerary' });
    }
}));
