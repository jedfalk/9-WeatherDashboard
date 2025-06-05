import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface Weather {
  temperature: number;
  description: string;
  city: string;
  [key: string]: any;
}

class WeatherService {
  private apiKey = process.env.OPENWEATHER_API_KEY;
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  private async fetchWeatherData(city: string): Promise<any> {
    if (!this.apiKey) {
      throw new Error('No OpenWeather API key set in .env');
    }
    const url = `${this.baseUrl}/weather?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`OpenWeather API error: ${response.statusText}`);
    }
    return response.json();
  }

  async getWeatherForCity(city: string): Promise<Weather> {
    const data = await this.fetchWeatherData(city);
    return {
      temperature: data.main.temp,
      description: data.weather[0].description,
      city: data.name,
      ...data,
    };
  }
}

export default new WeatherService();
