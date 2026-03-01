/**
 * Hybrid Weather Service
 * iOS: WeatherKit (native Apple weather)
 * Android: OpenWeatherMap (fallback)
 * Web: OpenWeatherMap
 */

import { Platform } from 'react-native';
import axios from 'axios';

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection?: number;
  condition: 'clear' | 'clouds' | 'rain' | 'snow' | 'thunderstorm' | 'unknown';
  description: string;
  icon: string;
  rainProbability: number;
  snowProbability: number;
  uvIndex?: number;
  visibility?: number;
  pressure?: number;
  source: 'weatherkit' | 'openweather' | 'unknown';
}

export interface WeatherForecast {
  hourly: WeatherData[];
  daily: WeatherData[];
}

class HybridWeatherService {
  private openWeatherApiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY || '';
  private openWeatherBaseUrl = 'https://api.openweathermap.org/data/2.5';

  /**
   * Get current weather - platform-specific
   */
  async getWeather(latitude: number, longitude: number): Promise<WeatherData | null> {
    try {
      if (Platform.OS === 'ios') {
        return await this.getWeatherFromWeatherKit(latitude, longitude);
      } else {
        return await this.getWeatherFromOpenWeather(latitude, longitude);
      }
    } catch (error) {
      console.error('Weather service error:', error);
      // Fallback to OpenWeatherMap
      return await this.getWeatherFromOpenWeather(latitude, longitude);
    }
  }

  /**
   * iOS: Get weather from native WeatherKit
   * Requires: WeatherKit entitlement in Apple Developer Account
   */
  private async getWeatherFromWeatherKit(
    latitude: number,
    longitude: number
  ): Promise<WeatherData | null> {
    try {
      // TODO: Implement WeatherKit integration
      // This requires native module or Expo module
      // For now, fallback to OpenWeatherMap
      console.log('WeatherKit not yet implemented, using OpenWeatherMap fallback');
      return await this.getWeatherFromOpenWeather(latitude, longitude);
    } catch (error) {
      console.error('WeatherKit error:', error);
      return null;
    }
  }

  /**
   * Android/Web: Get weather from OpenWeatherMap
   */
  private async getWeatherFromOpenWeather(
    latitude: number,
    longitude: number
  ): Promise<WeatherData | null> {
    try {
      if (!this.openWeatherApiKey) {
        console.warn('OpenWeatherMap API key not configured');
        return null;
      }

      const response = await axios.get(`${this.openWeatherBaseUrl}/weather`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: this.openWeatherApiKey,
          units: 'metric',
          lang: 'de',
        },
      });

      const data = response.data;
      return {
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
        windDirection: data.wind.deg,
        condition: this.mapWeatherCondition(data.weather[0].main),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        rainProbability: data.rain?.['1h'] ? Math.min(100, Math.round(data.rain['1h'] * 10)) : 0,
        snowProbability: data.snow?.['1h'] ? Math.min(100, Math.round(data.snow['1h'] * 10)) : 0,
        uvIndex: undefined, // Not in free tier
        visibility: data.visibility ? Math.round(data.visibility / 1000) : undefined,
        pressure: data.main.pressure,
        source: 'openweather',
      };
    } catch (error) {
      console.error('OpenWeatherMap error:', error);
      return null;
    }
  }

  /**
   * Get weather forecast - platform-specific
   */
  async getWeatherForecast(latitude: number, longitude: number): Promise<WeatherForecast | null> {
    try {
      if (Platform.OS === 'ios') {
        return await this.getForecastFromWeatherKit(latitude, longitude);
      } else {
        return await this.getForecastFromOpenWeather(latitude, longitude);
      }
    } catch (error) {
      console.error('Forecast service error:', error);
      return await this.getForecastFromOpenWeather(latitude, longitude);
    }
  }

  /**
   * iOS: Get forecast from WeatherKit
   */
  private async getForecastFromWeatherKit(
    latitude: number,
    longitude: number
  ): Promise<WeatherForecast | null> {
    try {
      // TODO: Implement WeatherKit forecast
      console.log('WeatherKit forecast not yet implemented, using OpenWeatherMap fallback');
      return await this.getForecastFromOpenWeather(latitude, longitude);
    } catch (error) {
      console.error('WeatherKit forecast error:', error);
      return null;
    }
  }

  /**
   * Android/Web: Get forecast from OpenWeatherMap
   */
  private async getForecastFromOpenWeather(
    latitude: number,
    longitude: number
  ): Promise<WeatherForecast | null> {
    try {
      if (!this.openWeatherApiKey) {
        console.warn('OpenWeatherMap API key not configured');
        return null;
      }

      const response = await axios.get(`${this.openWeatherBaseUrl}/forecast`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: this.openWeatherApiKey,
          units: 'metric',
          lang: 'de',
          cnt: 40, // 5 days
        },
      });

      const hourly: WeatherData[] = [];
      const daily: WeatherData[] = [];

      response.data.list.forEach((item: any, index: number) => {
        const weather: WeatherData = {
          temperature: Math.round(item.main.temp),
          feelsLike: Math.round(item.main.feels_like),
          humidity: item.main.humidity,
          windSpeed: Math.round(item.wind.speed * 3.6),
          windDirection: item.wind.deg,
          condition: this.mapWeatherCondition(item.weather[0].main),
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          rainProbability: item.rain?.['3h'] ? Math.min(100, Math.round(item.rain['3h'] * 10)) : 0,
          snowProbability: item.snow?.['3h'] ? Math.min(100, Math.round(item.snow['3h'] * 10)) : 0,
          source: 'openweather',
        };

        hourly.push(weather);

        // Daily: take every 8th entry (3-hour intervals, 8 * 3 = 24 hours)
        if (index % 8 === 0) {
          daily.push(weather);
        }
      });

      return { hourly, daily };
    } catch (error) {
      console.error('OpenWeatherMap forecast error:', error);
      return null;
    }
  }

  /**
   * Get rain probability for next N hours
   */
  async getRainNextHours(
    latitude: number,
    longitude: number,
    hours: number = 3
  ): Promise<Array<{ hour: number; probability: number }> | null> {
    try {
      const forecast = await this.getWeatherForecast(latitude, longitude);
      if (!forecast) return null;

      return forecast.hourly.slice(0, hours).map((weather, index) => ({
        hour: index + 1,
        probability: weather.rainProbability,
      }));
    } catch (error) {
      console.error('Rain forecast error:', error);
      return null;
    }
  }

  /**
   * Check if it will rain in next N minutes
   */
  async willRainSoon(
    latitude: number,
    longitude: number,
    minutesAhead: number = 60
  ): Promise<{ willRain: boolean; probability: number; timeUntilRain?: number }> {
    try {
      const forecast = await this.getWeatherForecast(latitude, longitude);
      if (!forecast) {
        return { willRain: false, probability: 0 };
      }

      const hoursAhead = Math.ceil(minutesAhead / 60);
      const relevantHours = forecast.hourly.slice(0, hoursAhead);
      const maxRainProbability = Math.max(...relevantHours.map((w) => w.rainProbability));

      return {
        willRain: maxRainProbability > 50,
        probability: maxRainProbability,
        timeUntilRain: maxRainProbability > 50 ? 30 : undefined, // Simplified
      };
    } catch (error) {
      console.error('Rain soon check error:', error);
      return { willRain: false, probability: 0 };
    }
  }

  private mapWeatherCondition(
    condition: string
  ): 'clear' | 'clouds' | 'rain' | 'snow' | 'thunderstorm' | 'unknown' {
    const lower = condition.toLowerCase();
    if (lower.includes('clear') || lower.includes('sunny')) return 'clear';
    if (lower.includes('cloud')) return 'clouds';
    if (lower.includes('rain') || lower.includes('drizzle')) return 'rain';
    if (lower.includes('snow')) return 'snow';
    if (lower.includes('thunder') || lower.includes('storm')) return 'thunderstorm';
    return 'unknown';
  }
}

export const hybridWeatherService = new HybridWeatherService();
