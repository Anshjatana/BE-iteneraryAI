import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config";

const genAI = new GoogleGenerativeAI(config.google.apiKey);

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  async generateItineraryRecommendations(params: {
    destination: string;
    duration: number;
    interests: string[];
    budget: string;
  }) {
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
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text());
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw new Error('Failed to generate recommendations');
    }
  }
}
