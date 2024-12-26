import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import Constants from 'expo-constants';

export default function Index() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [weather, setWeather] = useState<{
        city: string;
        temperature: number;
        condition: string;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                // Request location permissions
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setError('Permission to access location was denied');
                    setLoading(false);
                    return;
                }

                // Get current location
                let location = await Location.getCurrentPositionAsync({});
                setLocation(location);

                // Determine API URL dynamically
                const apiUrl = Platform.select({
                    ios: 'http://192.168.68.91:8080',
                    android: 'http://10.0.2.2:8080',
                    default: 'http://localhost:8080'
                });

                // Fetch weather using current location
                const response = await fetch(`${apiUrl}/api/weather/current?lat=${location.coords.latitude}&lon=${location.coords.longitude}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to fetch weather data: ${errorText}`);
                }

                const weatherData = await response.json();

                setWeather({
                    city: weatherData.location_name,
                    temperature: Math.round(weatherData.temperature),
                    condition: weatherData.description
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>{error}</Text>
                <Text style={styles.errorDetails}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {weather && (
                <>
                    <Text style={styles.city}>{weather.city}</Text>
                    <Text style={styles.temperature}>{weather.temperature}°</Text>
                    <MaterialCommunityIcons 
                        name={getWeatherIcon(weather.condition)} 
                        size={100} 
                        color="white" 
                    />
                    <Text style={styles.condition}>{weather.condition}</Text>
                </>
            )}
        </View>
    );
}

// Helper function to map weather conditions to appropriate icons
function getWeatherIcon(condition: string): keyof typeof MaterialCommunityIcons.glyphMap {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('snow')) return 'snowflake';
    if (conditionLower.includes('rain')) return 'weather-rainy';
    if (conditionLower.includes('cloud')) return 'weather-cloudy';
    if (conditionLower.includes('clear')) return 'weather-sunny';
    return 'weather-partly-cloudy'; // default icon
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#7393B3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    city: {
        fontSize: 48,
        color: 'white',
        marginBottom: 10,
    },
    temperature: {
        fontSize: 86,
        color: 'white',
        marginBottom: 20,
    },
    condition: {
        fontSize: 24,
        color: 'white',
        marginTop: 10,
        textTransform: 'capitalize',
    },
    error: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        margin: 20,
    },
    errorDetails: {
        color: 'red',
        fontSize: 14,
        textAlign: 'center',
        marginHorizontal: 20,
    },
});
