/**
 * Weather Service Integration
 * - OpenWeatherMap API integration
 * - AI-powered recommendations for walks
 * - Pet weather tolerance consideration
 */

import axios from 'axios';

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: 'clear' | 'clouds' | 'rain' | 'snow' | 'thunderstorm' | 'unknown';
  description: string;
  icon: string;
  rainProbability: number; // 0-100
  rainNextHours: Array<{ hour: number; probability: number }>;
  snowProbability: number; // 0-100
}

export interface WalkRecommendation {
  recommended: boolean;
  urgency: 'now' | 'soon' | 'wait' | 'not_recommended';
  reason: string;
  petConsiderations: string[];
  weatherWarnings: string[];
  bestTimeWindow?: { start: string; end: string };
}

export interface PetWeatherPreferences {
  rainTolerance: 'loves' | 'tolerates' | 'dislikes' | 'hates'; // 0-100 scale
  snowTolerance: 'loves' | 'tolerates' | 'dislikes' | 'hates';
  maxTemperature: number; // Celsius
  minTemperature: number; // Celsius
  windTolerance: 'high' | 'medium' | 'low';
}

class WeatherService {
  private apiKey: string = process.env.OPENWEATHER_API_KEY || '';
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  /**
   * Get current weather for coordinates
   */
  async getWeather(latitude: number, longitude: number): Promise<WeatherData | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: this.apiKey,
          units: 'metric',
        },
      });

      const data = response.data;
      return {
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        condition: this.mapWeatherCondition(data.weather[0].main),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        rainProbability: data.rain?.['1h'] ? Math.min(100, data.rain['1h'] * 10) : 0,
        rainNextHours: [], // Would need forecast API
        snowProbability: data.snow?.['1h'] ? Math.min(100, data.snow['1h'] * 10) : 0,
      };
    } catch (error) {
      console.error('Weather API error:', error);
      return null;
    }
  }

  /**
   * Get weather forecast for next 48 hours
   */
  async getWeatherForecast(
    latitude: number,
    longitude: number
  ): Promise<WeatherData[] | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: this.apiKey,
          units: 'metric',
          cnt: 16, // 48 hours (3-hour intervals)
        },
      });

      return response.data.list.map((item: any) => ({
        temperature: item.main.temp,
        feelsLike: item.main.feels_like,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
        condition: this.mapWeatherCondition(item.weather[0].main),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        rainProbability: item.rain?.['3h'] ? Math.min(100, item.rain['3h'] * 10) : 0,
        snowProbability: item.snow?.['3h'] ? Math.min(100, item.snow['3h'] * 10) : 0,
        rainNextHours: [],
      }));
    } catch (error) {
      console.error('Weather forecast API error:', error);
      return null;
    }
  }

  /**
   * Get AI-powered walk recommendation
   */
  async getWalkRecommendation(
    weather: WeatherData,
    petPreferences: PetWeatherPreferences,
    lastWalkTime?: Date
  ): Promise<WalkRecommendation> {
    const warnings: string[] = [];
    const considerations: string[] = [];
    let urgency: 'now' | 'soon' | 'wait' | 'not_recommended' = 'wait';
    let recommended = true;

    // Temperature check
    if (weather.temperature > petPreferences.maxTemperature) {
      warnings.push(
        `Zu warm (${weather.temperature}°C). Gefühlte Temperatur: ${weather.feelsLike}°C`
      );
      urgency = 'not_recommended';
      recommended = false;
    }
    if (weather.temperature < petPreferences.minTemperature) {
      warnings.push(
        `Zu kalt (${weather.temperature}°C). Gefühlte Temperatur: ${weather.feelsLike}°C`
      );
      urgency = 'not_recommended';
      recommended = false;
    }

    // Rain check
    if (weather.rainProbability > 70 && petPreferences.rainTolerance === 'hates') {
      warnings.push(`Hohe Regenwahrscheinlichkeit (${weather.rainProbability}%)`);
      urgency = 'wait';
      recommended = false;
    } else if (weather.rainProbability > 50 && petPreferences.rainTolerance === 'dislikes') {
      considerations.push(`Dein Tier mag Regen nicht - Regenschutz empfohlen`);
      urgency = 'soon';
    }

    // Snow check
    if (weather.snowProbability > 50 && petPreferences.snowTolerance === 'hates') {
      warnings.push(`Schneefall erwartet (${weather.snowProbability}%)`);
      urgency = 'wait';
      recommended = false;
    }

    // Wind check
    if (weather.windSpeed > 30 && petPreferences.windTolerance === 'low') {
      warnings.push(`Starker Wind (${weather.windSpeed} km/h)`);
      urgency = 'wait';
      recommended = false;
    }

    // Determine best time window
    let bestTimeWindow: { start: string; end: string } | undefined;
    if (recommended) {
      if (weather.rainProbability > 30) {
        bestTimeWindow = { start: '06:00', end: '09:00' };
        considerations.push('Beste Zeit: Früh morgens vor Regen');
      } else {
        bestTimeWindow = { start: '09:00', end: '18:00' };
      }
      urgency = 'soon';
    }

    return {
      recommended,
      urgency,
      reason: this.generateReason(weather, petPreferences),
      petConsiderations: considerations,
      weatherWarnings: warnings,
      bestTimeWindow,
    };
  }

  private mapWeatherCondition(
    condition: string
  ): 'clear' | 'clouds' | 'rain' | 'snow' | 'thunderstorm' | 'unknown' {
    const lower = condition.toLowerCase();
    if (lower.includes('clear') || lower.includes('sunny')) return 'clear';
    if (lower.includes('cloud')) return 'clouds';
    if (lower.includes('rain')) return 'rain';
    if (lower.includes('snow')) return 'snow';
    if (lower.includes('thunder') || lower.includes('storm')) return 'thunderstorm';
    return 'unknown';
  }

  private generateReason(
    weather: WeatherData,
    preferences: PetWeatherPreferences
  ): string {
    if (weather.condition === 'clear') {
      return `Perfektes Wetter zum Gassi gehen! ${weather.temperature}°C, sonnig.`;
    }
    if (weather.condition === 'clouds') {
      return `Bewölkt, aber angenehm. ${weather.temperature}°C.`;
    }
    if (weather.rainProbability > 70) {
      return `Regen erwartet. Regenschutz empfohlen.`;
    }
    if (weather.snowProbability > 50) {
      return `Schneefall möglich. Achte auf Pfotenschutz.`;
    }
    return `Wetter: ${weather.description}`;
  }
}

export const weatherService = new WeatherService();
