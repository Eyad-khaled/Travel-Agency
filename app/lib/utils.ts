import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";









declare interface Activity {
  time: string;
  description: string;
}

declare interface DayPlan {
  day: number;
  location: string;
  activities: Activity[];
}

declare interface Location {
  city: string;
  coordinates: [number, number];
  openStreetMap: string;
}

declare interface Trip {
  id: string;
  name: string;
  description: string;
  estimatedPrice: string;
  duration: number;
  budget: string;
  travelStyle: string;
  interests: string;
  groupType: string;
  country: string;
  imageUrls: string[];
  itinerary: DayPlan[];
  bestTimeToVisit: string[];
  weatherInfo: string[];
  location: Location;
  payment_link: string;
}



declare interface TrendResult {
  trend: "increment" | "decrement" | "no change";
  percentage: number;
}











declare interface TripFormData {
  country: string;
  travelStyle: string;
  interest: string;
  budget: string;
  duration: number;
  groupType: string;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string): string => {
  return dayjs(dateString).format("MMMM DD, YYYY");
};

export function parseMarkdownToJson(input: string): any | null {
  // If input is already an object, return it
  if (typeof input === "object" && input !== null) return input;

  // First, try parsing directly
  try {
    return JSON.parse(input);
  } catch (err) {
    // Not valid JSON, try cleaning markdown code block
    try {
      const cleaned = input
        .trim()
        .replace(/^```json\s*/, "")
        .replace(/^```\s*/, "") // handle generic ```
        .replace(/```$/, "");
      return JSON.parse(cleaned);
    } catch (err2) {
      console.error("Failed to parse JSON:", err2);
      return null;
    }
  }
}

export function parseTripData(jsonString: string): Trip | null {
  try {
    const data: Trip = JSON.parse(jsonString);

    return data;
  } catch (error) {
    console.error("Failed to parse trip data:", error);
    return null;
  }
}

export function getFirstWord(input: string = ""): string {
  return input.trim().split(/\s+/)[0] || "";
}

/**
 * Convert an ISO 3166-1 alpha-2 country code (e.g. "eg") to its
 * corresponding emoji flag (🇪🇬). Returns an empty string for invalid input.
 */

export const calculateTrendPercentage = (
  countOfThisMonth: number,
  countOfLastMonth: number
): TrendResult => {
  if (countOfLastMonth === 0) {
    return countOfThisMonth === 0
      ? { trend: "no change", percentage: 0 }
      : { trend: "increment", percentage: 100 };
  }

  const change = countOfThisMonth - countOfLastMonth;
  const percentage = Math.abs((change / countOfLastMonth) * 100);

  if (change > 0) {
    return { trend: "increment", percentage };
  } else if (change < 0) {
    return { trend: "decrement", percentage };
  } else {
    return { trend: "no change", percentage: 0 };
  }
};

export const formatKey = (key: keyof TripFormData) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};
