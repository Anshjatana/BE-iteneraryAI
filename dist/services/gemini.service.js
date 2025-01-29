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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const generative_ai_1 = require("@google/generative-ai");
const config_1 = require("../config");
const genAI = new generative_ai_1.GoogleGenerativeAI(config_1.config.google.apiKey);
class GeminiService {
    constructor() {
        this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    }
    generateItineraryRecommendations(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = `Create a detailed travel itinerary for ${params.destination} with the following specifications:
Duration: ${params.duration} days
Interests: ${params.interests.join(", ")}
Budget: ${params.budget}

Please provide a structured JSON response with exactly two keys: "overview" and "days".

The "overview" object should include:
- total_budget: Estimated total cost range based on the selected preferences based on currency of the country
- highlights: Key attractions and experiences
- best_time_to_visit: Recommended seasons or months, be specific to the destination, give a range if needed but should be close to the actual best time to visit
- travel_tips: Important local information and advice

The "days" array should contain ${params.duration} day objects, each with:
- morning_activity: { 
    name: "Activity name",
    description: "Detailed description",
    duration: "Approximate duration",
    cost: "Estimated cost"
  }
- afternoon_activity: {Same structure as morning}
- evening_activity: {Same structure as morning}

Example format:
{
  "overview": {
    "total_budget": "Estimated $X-$Y per person",
    "highlights": ["Key attraction 1", "Experience 2", ...],
    "best_time_to_visit": "Season/months",
    "travel_tips": ["Tip 1", "Tip 2", ...]
  },
  "days": [
    {
      "morning_activity": {
        "name": "Visit X",
        "description": "Detailed description",
        "duration": "2-3 hours",
        "cost": "$X"
      },
      "afternoon_activity": {...},
      "evening_activity": {...}
    }
  ]
}

Focus on activities matching the specified interests. Include specific restaurants, attractions, and activities appropriate for each time of day. Ensure all recommendations are realistic and accessible.`;
            try {
                const result = yield this.model.generateContent(prompt);
                const response = yield result.response;
                return JSON.parse(response.text());
            }
            catch (error) {
                console.error('Error generating recommendations:', error);
                throw new Error('Failed to generate recommendations');
            }
        });
    }
}
exports.GeminiService = GeminiService;
