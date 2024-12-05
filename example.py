from weather_service import WeatherService

def main():
    weather = WeatherService()
    try:
        # Example locations with their coordinates
        locations = [
            (51.5074, -0.1278, "London"),  # London
            (40.7128, -74.0060, "New York"),  # New York
            (35.6762, 139.6503, "Tokyo"),  # Tokyo
        ]
        
        for lat, lon, city in locations:
            weather_data = weather.get_current_weather(lat, lon)
            print(f"\nWeather in {weather_data['location_name']} (expected: {city}):")
            print(f"Temperature: {weather_data['temperature']}°C")
            print(f"Feels like: {weather_data['feels_like']}°C")
            print(f"Conditions: {weather_data['description']}")
            print(f"Humidity: {weather_data['humidity']}%")
            print(f"Wind speed: {weather_data['wind_speed']} m/s")
            
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()
