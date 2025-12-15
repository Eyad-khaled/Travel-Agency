import express, { Request, Response } from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { parseMarkdownToJson } from "./app/lib/utils";
import { appwriteConfig, database } from "./app/appwrite/client";
import { ID } from "appwrite";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post("/api/create-trip", async (req: Request, res: Response) => {
  try {
    const {
      country,
      numberOfDays,
      travelStyle,
      interests,
      budget,
      groupType,
      userId,
    } = req.body;

    if (
      !country ||
      !numberOfDays ||
      !travelStyle ||
      !interests ||
      !budget ||
      !groupType ||
      !userId
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const geminiApiKey = process.env.VITE_GEMINI_APIKEY;
    const unSplashApiKey = process.env.VITE_UNSPLASH_ACCESS_KEY;

    if (!geminiApiKey || !unSplashApiKey) {
      return res
        .status(500)
        .json({ error: "Missing API keys in environment variables" });
    }

    const genAi = new GoogleGenerativeAI(geminiApiKey);

    const prompt = `Generate a ${numberOfDays}-day travel itinerary for ${country} based on the following user information:
    Budget: '${budget}'
    Interests: '${interests}'
    TravelStyle: '${travelStyle}'
    GroupType: '${groupType}'
    Return the itinerary and lowest estimated price in a clean, non-markdown JSON format with the following structure:
    {
    "name": "A descriptive title for the trip",
    "description": "A brief description of the trip and its highlights not exceeding 100 words",
    "estimatedPrice": "Lowest average price for the trip in USD, e.g.$price",
    "duration": ${numberOfDays},
    "budget": "${budget}",
    "travelStyle": "${travelStyle}",
    "country": "${country}",
    "interests": ${interests},
    "groupType": "${groupType}",
    "bestTimeToVisit": [
      '🌸 Season (from month to month): reason to visit',
      '☀️ Season (from month to month): reason to visit',
      '🍁 Season (from month to month): reason to visit',
      '❄️ Season (from month to month): reason to visit'
    ],
    "weatherInfo": [
      '☀️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
      '🌦️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
      '🌧️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
      '❄️ Season: temperature range in Celsius (temperature range in Fahrenheit)'
    ],
    "location": {
      "city": "name of the city or region",
      "coordinates": [latitude, longitude],
      "openStreetMap": "link to open street map"
    },
    "itinerary": [
    {
      "day": 1,
      "location": "City/Region Name",
      "activities": [
        {"time": "Morning", "description": "🏰 Visit the local historic castle and enjoy a scenic walk"},
        {"time": "Afternoon", "description": "🖼️ Explore a famous art museum with a guided tour"},
        {"time": "Evening", "description": "🍷 Dine at a rooftop restaurant with local wine"}
      ]
    }
    ]
    }`;

    const model = genAi.getGenerativeModel({ model: "gemini-2.0-flash" });
    const textResult = await model.generateContent([prompt]);

    const trip = parseMarkdownToJson(textResult.response.text());

    if (!trip) {
      return res
        .status(500)
        .json({ error: "Failed to parse AI response as JSON" });
    }

    const imageResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${country} ${interests} ${travelStyle}&client_id=${unSplashApiKey}`
    );
    const imageData = await imageResponse.json();
    const imageUrls = imageData.results
      .slice(0, 3)
      .map((image: any) => image.urls?.regular || null);

    const result = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.tripsCollectionId,
      ID.unique(),
      {
        tripDetail: JSON.stringify(trip),
        imageUrls: JSON.stringify(imageUrls),
        userId,
      }
    );

    res.json({ id: result.$id });
  } catch (error) {
    console.error("Error generating trip plan:", error);
    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate trip plan",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
