import { GoogleGenerativeAI } from "@google/generative-ai";
import { parseMarkdownToJson } from "../../app/lib/utils";
import { appwriteConfig, client} from "../../app/appwrite/client";
import { ID, TablesDB } from "appwrite";

export const action = async (formData,setLoading) => {
  const {
    country,
    duration,
    travelStyle,
    interest,
    budget,
    groupType,
    userId,
  } = formData;

  try {
    const genAi = new GoogleGenerativeAI(
      import.meta.env.VITE_GEMINI_APIKEY)

    const prompt = `Generate a ${duration}-day travel itinerary for ${country} based on the following user information:
    Budget: '${budget}'
    Interest: '${interest}'
    TravelStyle: '${travelStyle}'
    GroupType: '${groupType}'
    Return the itinerary and lowest estimated price in a clean, non-markdown JSON format with the following structure:
    {
    "name": "A descriptive title for the trip",
    "description": "A brief description of the trip and its highlights not exceeding 100 words",
    "estimatedPrice": "Lowest average price for the trip in USD, e.g.$price",
    "duration": ${duration},
    "budget": "${budget}",
    "travelStyle": "${travelStyle}",
    "country": "${country}",
    "interest": ${interest},
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
    },
    ...
    ]
    }`;

    const model = genAi.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    const generateTextResult = await model.generateContent(prompt);
    const response =  generateTextResult.response;
    const text = response.text();

    // console.log("AI raw output:", text);
    const tripText = parseMarkdownToJson(text)
    
    
    const imagesResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${country} ${interest} ${travelStyle}&client_id=${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`
    )
    const imageUrls = (await imagesResponse.json()).results.slice(0,3).map((image)=> image.urls.regular || null )
     const tableDB = new TablesDB(client)
     const tripResult = await tableDB.createRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.tripsCollectionId,
        rowId: ID.unique(),
        data: {tripDetails:text ,
          imageUrls,
          userId,
          createdAt: new Date().toISOString()
        }
      }); 
    return tripResult
    
  
  } catch (error) {
    console.error("Error generating trip plan:", error);
    throw error;
  }finally{
    setLoading(false)
  }
};
