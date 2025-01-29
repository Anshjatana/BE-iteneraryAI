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
exports.aiRoutes = void 0;
const express_1 = __importDefault(require("express"));
const gemini_service_1 = require("../services/gemini.service");
const router = express_1.default.Router();
exports.aiRoutes = router;
const geminiService = new gemini_service_1.GeminiService();
// Endpoint to generate itinerary recommendations
router.post('/recommendations', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { destination, duration, interests, budget } = req.body;
        // Validate input parameters
        if (!destination || !duration || !Array.isArray(interests) || interests.length === 0) {
            return res.status(400).json({ error: 'Invalid input parameters' });
        }
        const recommendations = yield geminiService.generateItineraryRecommendations({
            destination,
            duration,
            interests,
            budget
        });
        res.json(recommendations);
    }
    catch (error) {
        console.error('Error generating itinerary recommendations:', error);
        res.status(500).json({ error: 'Failed to generate recommendations' });
    }
}));
