import { describe, it, expect, beforeAll } from 'vitest';
import axios from 'axios';

/**
 * Test OpenWeatherMap API integration
 */

describe('OpenWeatherMap API', () => {
  const apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
  const baseUrl = 'https://api.openweathermap.org/data/2.5';

  beforeAll(() => {
    if (!apiKey) {
      throw new Error('EXPO_PUBLIC_OPENWEATHER_API_KEY not configured');
    }
  });

  it('should fetch current weather for Berlin', async () => {
    try {
      const response = await axios.get(`${baseUrl}/weather`, {
        params: {
          lat: 52.52, // Berlin
          lon: 13.405,
          appid: apiKey,
          units: 'metric',
          lang: 'de',
        },
        timeout: 5000,
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('main');
      expect(response.data.main).toHaveProperty('temp');
      expect(response.data.main).toHaveProperty('humidity');
      expect(response.data).toHaveProperty('weather');
      expect(response.data.weather.length).toBeGreaterThan(0);

      console.log('✅ OpenWeatherMap API working:', {
        temperature: response.data.main.temp,
        condition: response.data.weather[0].main,
        humidity: response.data.main.humidity,
      });
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Invalid OpenWeatherMap API Key');
      }
      throw error;
    }
  });

  it('should fetch weather forecast', async () => {
    try {
      const response = await axios.get(`${baseUrl}/forecast`, {
        params: {
          lat: 52.52,
          lon: 13.405,
          appid: apiKey,
          units: 'metric',
          lang: 'de',
          cnt: 40,
        },
        timeout: 5000,
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('list');
      expect(response.data.list.length).toBeGreaterThan(0);

      console.log('✅ OpenWeatherMap Forecast API working:', {
        forecasts: response.data.list.length,
        firstForecast: response.data.list[0].main.temp,
      });
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Invalid OpenWeatherMap API Key');
      }
      throw error;
    }
  });
});
