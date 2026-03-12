/**
 * Walk Tracker Service
 * Handles GPS tracking, distance calculation, and weather data for walks
 */

import * as Location from "expo-location";
import type { WalkEvent } from "@/store/types";

export interface WalkSession {
  id: string;
  petId: string;
  startTime: Date;
  startLocation: Location.LocationObject;
  currentLocation?: Location.LocationObject;
  distance: number; // in kilometers
  duration: number; // in seconds
  route: Array<{ latitude: number; longitude: number }>;
  isActive: boolean;
  weather?: WeatherData;
}

export interface WeatherData {
  temperature: number; // Celsius
  condition: string; // e.g., "Sunny", "Rainy", "Cloudy"
  humidity: number; // percentage
  windSpeed: number; // km/h
  icon: string; // weather icon emoji
}

const EARTH_RADIUS_KM = 6371;

/**
 * Request location permissions
 */
export async function requestLocationPermission(): Promise<boolean> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Error requesting location permission:", error);
    return false;
  }
}

/**
 * Start a new walk session
 */
export async function startWalkSession(petId: string): Promise<WalkSession | null> {
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      console.error("Location permission denied");
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const weather = await fetchWeatherData(
      location.coords.latitude,
      location.coords.longitude
    );

    const sessionId = Math.random().toString(36).substring(2, 11);

    return {
      id: sessionId,
      petId,
      startTime: new Date(),
      startLocation: location,
      currentLocation: location,
      distance: 0,
      duration: 0,
      route: [
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      ],
      isActive: true,
      weather,
    };
  } catch (error) {
    console.error("Error starting walk session:", error);
    return null;
  }
}

/**
 * Update walk session with current location
 */
export async function updateWalkSession(
  session: WalkSession
): Promise<WalkSession> {
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const newDistance =
      session.distance +
      calculateDistance(
        session.currentLocation?.coords.latitude || session.startLocation.coords.latitude,
        session.currentLocation?.coords.longitude || session.startLocation.coords.longitude,
        location.coords.latitude,
        location.coords.longitude
      );

    const duration = Math.floor(
      (new Date().getTime() - session.startTime.getTime()) / 1000
    );

    return {
      ...session,
      currentLocation: location,
      distance: newDistance,
      duration,
      route: [
        ...session.route,
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      ],
    };
  } catch (error) {
    console.error("Error updating walk session:", error);
    return session;
  }
}

/**
 * End walk session and return walk event
 */
export function endWalkSession(session: WalkSession): WalkEvent {
  return {
    id: session.id,
    timestamp: new Date().toISOString(),
    distance: Math.round(session.distance * 100) / 100,
    duration: Math.floor(session.duration / 60),
    route: JSON.stringify(session.route),
    weather: session.weather ? {
      temperature: session.weather.temperature,
      condition: session.weather.condition,
      humidity: session.weather.humidity,
    } : undefined,
    performedBy: "Unknown",
    notes: `Walk started at ${session.startTime.toLocaleTimeString("de-DE")}`,
  };
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Fetch weather data from OpenWeather API
 * Note: Requires OPENWEATHER_API_KEY environment variable
 */
async function fetchWeatherData(
  latitude: number,
  longitude: number
): Promise<WeatherData | undefined> {
  try {
    const apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) {
      console.warn("OpenWeather API key not configured");
      return undefined;
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      console.error("Weather API error:", response.statusText);
      return undefined;
    }

    const data = await response.json();

    return {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      icon: getWeatherIcon(data.weather[0].main),
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return undefined;
  }
}

/**
 * Get emoji icon for weather condition
 */
function getWeatherIcon(condition: string): string {
  const icons: Record<string, string> = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Drizzle: "🌦️",
    Thunderstorm: "⛈️",
    Snow: "❄️",
    Mist: "🌫️",
    Smoke: "💨",
    Haze: "🌫️",
    Dust: "🌪️",
    Fog: "🌫️",
    Sand: "🌪️",
    Ash: "💨",
    Squall: "🌪️",
    Tornado: "🌪️",
  };
  return icons[condition] || "🌡️";
}

/**
 * Format duration for display
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${(Math.round(km * 100) / 100).toFixed(2)}km`;
}
