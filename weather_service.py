import os
import requests
from typing import Dict, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class WeatherService:
    """Service for interacting with OpenWeatherMap API"""
    
    BASE_URL = "https://api.openweathermap.org/data/2.5/weather"
    
    def __init__(self):
        self.api_key = os.getenv("OPENWEATHER_API_KEY")
        if not self.api_key:
            raise ValueError("OpenWeather API key not found. Please set OPENWEATHER_API_KEY environment variable.")
        # Remove quotes if present in the API key
        self.api_key = self.api_key.strip('"')
    
    def get_current_weather(self, lat: float, lon: float) -> Dict:
        """
        Get current weather for a given location using coordinates
        
        Args:
            lat (float): Latitude of the location
            lon (float): Longitude of the location
        
        Returns:
            dict: Weather data including temperature and conditions
            
        Raises:
            requests.RequestException: If the API request fails
            ValueError: If the coordinates are invalid
        """
        if not (-90 <= lat <= 90) or not (-180 <= lon <= 180):
            raise ValueError("Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180")
            
        params = {
            "lat": lat,
            "lon": lon,
            "appid": self.api_key,
            "units": "metric"  # Use Celsius for temperature
        }
        
        try:
            response = requests.get(self.BASE_URL, params=params)
            response.raise_for_status()
            
            data = response.json()
            
            return {
                "temperature": data["main"]["temp"],
                "feels_like": data["main"]["feels_like"],
                "humidity": data["main"]["humidity"],
                "description": data["weather"][0]["description"],
                "wind_speed": data["wind"]["speed"],
                "location_name": data["name"]
            }
            
        except requests.RequestException as e:
            raise requests.RequestException(f"Failed to fetch weather data: {str(e)}")

# Example usage
if __name__ == "__main__":
    weather_service = WeatherService()
    try:
        # Example: Get weather for London (51.5074° N, 0.1278° W)
        weather = weather_service.get_current_weather(51.5074, -0.1278)
        print(f"Current weather in {weather['location_name']}:")
        print(f"Temperature: {weather['temperature']}°C")
        print(f"Conditions: {weather['description']}")
        print(f"Humidity: {weather['humidity']}%")
        print(f"Wind speed: {weather['wind_speed']} m/s")
    except Exception as e:
        print(f"Error: {str(e)}")
