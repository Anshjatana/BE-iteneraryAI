import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config";

const genAI = new GoogleGenerativeAI(config.google.apiKey);

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: "gemini-pro" });

  /**
   * Generate travel itinerary recommendations based on the destination, duration, and interests.
   * @param params - Object containing destination, duration, and interests.
   * @returns A structured JSON object with daily recommendations.
   */
  async generateItineraryRecommendations(params: {
    destination: string;
    duration: number;
    interests: string[];
  }) {
    const interests = params.interests.length
      ? params.interests
      : ["culture", "food", "sightseeing"];

    const prompt = `Create a detailed ${
      params.duration
    }-day travel itinerary for ${
      params.destination
    } focusing on these interests: ${interests.join(
      ", "
    )}. Include specific recommendations for restaurants, attractions, and activities for each day. 
    Format the response as a structured JSON object with "days" as keys and "activities" as arrays.
    Dont give any other key in the response.
    Also give me overview of the trip with "overview" as keys, including the total budget and travel dates and any other relevant information if needed.
    Example schema: 
    {"_id":{"$oid":"678e3d3669b648ba238366af"},"userId":"1737375001648","destination":"Fatehabad, Haryana, India","placeId":"ChIJXYbs4cFlETkR63Qo3gisDMA","startDate":"2025-01-21T18:30:00.000Z","endDate":"2025-01-23T18:30:00.000Z","travelGroup":"couple","interests":["food"],"budget":"luxury","recommendations":{"overview":{
    "total_budget":"Varies depending on travel style and preferences",
"travel_dates":"21st January 2025 - 23rd January 2025",
"info":"Fatehabad is a city in the northern Indian state of Haryana. It is known for its rich culinary heritage. This itinerary focuses on exploring the city's diverse food scene."
    }
    ,"days":[{"activities":["Morning:","1. Visit the historic Fatehabad Fort, showcasing the architectural brilliance of the Mughal era.","2. Lunch: Indulge in a delectable lunch at Hotel Manglam, savoring authentic Haryanvi dishes.","Afternoon:","3. Explore the vibrant Fatehabad Bazaar, immerse yourself in local culture, and shop for traditional handicrafts.","4. Evening: Relish a delightful dinner at Dhaba Highway King, known for its mouthwatering Punjabi cuisine."]},{"activities":["Morning:","1. Embark on a culinary adventure at Chandu Halwai, famous for its irresistible sweets and savory snacks.","2. Lunch: Head to The Grand Noormahal for a luxurious dining experience featuring global flavors.","Afternoon:","3. Immerse yourself in the flavors of Fatehabad at a local food stall, sampling mouthwatering street food.","4. Evening: Conclude your gastronomic journey with an unforgettable dinner at Hotel Gulzar Grand, celebrated for its authentic Indian cuisine."]}]},"__v":{"$numberInt":"0"}}
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const responseText = await result.response.text(); // Ensure the response text is awaited
      console.log("Raw response from AI:", responseText); // Log raw response for debugging

      // Clean up the response text to ensure valid JSON
      const cleanedResponseText = responseText
        .replace(/```json|```/g, "")
        .trim();
      console.log("Cleaned response text:", cleanedResponseText); // Log cleaned response

      const itinerary = JSON.parse(cleanedResponseText);

      // Validate the structure of the itinerary
      if (
        !itinerary ||
        typeof itinerary !== "object" ||
        !itinerary.days ||
        !Object.keys(itinerary.days).length
      ) {
        throw new Error(
          'Invalid itinerary structure: Missing or empty "days" field'
        );
      }

      return itinerary;
    } catch (error: any) {
      console.error("Error generating itinerary recommendations:", error);
      throw new Error(
        `Failed to generate itinerary recommendations: ${error.message}`
      );
    }
  }

  /**
   * Get detailed insights for a specific place.
   * @param placeName - The name of the place.
   * @param placeType - The type of place (e.g., city, attraction).
   * @returns A JSON object with sections for history, bestTimeToVisit, and tips.
   */
  async getPlaceInsights(placeName: string, placeType: string) {
    const prompt = `Provide detailed insights about ${placeName} as a ${placeType} destination. 
    Include historical significance, best times to visit, and insider tips. 
    Format the response as a JSON object with the following structure: 
    {
      "history": "Historical significance of the place",
      "bestTimeToVisit": "Best time of the year to visit",
      "tips": ["Insider tip 1", "Insider tip 2", "..."]
    }.`;

    try {
      const result = await this.model.generateContent(prompt);
      const responseText = await result.response.text(); // Ensure response is awaited

      // Clean up the response text to ensure valid JSON
      const cleanedResponseText = responseText
        .replace(/```json|```/g, "")
        .trim();

      const insights = JSON.parse(cleanedResponseText);

      // Validate the structure of insights
      if (
        !insights ||
        typeof insights !== "object" ||
        !insights.history ||
        !insights.bestTimeToVisit ||
        !Array.isArray(insights.tips)
      ) {
        throw new Error("Invalid place insights response format");
      }

      return insights;
    } catch (error: any) {
      console.error("Error getting place insights:", error);
      throw new Error("Failed to get place insights");
    }
  }
}
