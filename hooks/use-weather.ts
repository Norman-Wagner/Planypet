import { useState, useEffect } from "react";

export interface WeatherData {
  temperature: number;
  condition: "sunny" | "cloudy" | "rainy" | "snowy" | "stormy";
  humidity: number;
  windSpeed: number;
  location: string;
}

export interface WalkRecommendation {
  suitable: boolean;
  reason: string;
  warning?: string;
}

/**
 * Hook for weather data and walk recommendations
 * Note: Uses mock data. In production, integrate with OpenWeatherMap API
 */
export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with mock data
    const fetchWeather = async () => {
      setLoading(true);
      // In production: const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
      
      // Mock data
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const mockWeather: WeatherData = {
        temperature: 18,
        condition: "sunny",
        humidity: 65,
        windSpeed: 12,
        location: "Berlin",
      };
      
      setWeather(mockWeather);
      setLoading(false);
    };

    fetchWeather();
  }, []);

  const getWalkRecommendation = (weather: WeatherData | null): WalkRecommendation => {
    if (!weather) {
      return {
        suitable: true,
        reason: "Wetterdaten werden geladen...",
      };
    }

    // Too hot
    if (weather.temperature > 30) {
      return {
        suitable: false,
        reason: "Zu heiß für längere Spaziergänge",
        warning: "Vermeide die Mittagshitze und gehe früh morgens oder spät abends Gassi.",
      };
    }

    // Too cold
    if (weather.temperature < -5) {
      return {
        suitable: false,
        reason: "Sehr kalt draußen",
        warning: "Kurze Runden bevorzugen. Bei kleinen Hunden ggf. Hundejacke verwenden.",
      };
    }

    // Rainy
    if (weather.condition === "rainy") {
      return {
        suitable: true,
        reason: "Regen erwartet",
        warning: "Denk an Regenschutz für dich und dein Tier!",
      };
    }

    // Stormy
    if (weather.condition === "stormy") {
      return {
        suitable: false,
        reason: "Sturm und Gewitter",
        warning: "Bleib besser drinnen und warte, bis das Wetter sich beruhigt.",
      };
    }

    // Perfect weather
    return {
      suitable: true,
      reason: "Perfektes Wetter für einen Spaziergang!",
    };
  };

  const getWeatherIcon = (condition: string): string => {
    switch (condition) {
      case "sunny":
        return "☀️";
      case "cloudy":
        return "☁️";
      case "rainy":
        return "🌧️";
      case "snowy":
        return "❄️";
      case "stormy":
        return "⛈️";
      default:
        return "🌤️";
    }
  };

  const getWeatherColor = (condition: string): string => {
    switch (condition) {
      case "sunny":
        return "#FFA500";
      case "cloudy":
        return "#9CA3AF";
      case "rainy":
        return "#3B82F6";
      case "snowy":
        return "#60A5FA";
      case "stormy":
        return "#EF4444";
      default:
        return "#10B981";
    }
  };

  return {
    weather,
    loading,
    walkRecommendation: getWalkRecommendation(weather),
    getWeatherIcon,
    getWeatherColor,
  };
}
