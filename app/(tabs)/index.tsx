import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

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
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setError('Permission to access location was denied');
                    setLoading(false);
                    return;
                }

                let location = await Location.getCurrentPositionAsync({});
                setLocation(location);

                // Note: Replace with actual weather API
                setWeather({
                    city: 'Chicago',
                    temperature: -18,
                    condition: 'snow'
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
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {weather && (
                <>
                    <Text style={styles.city}>{weather.city}</Text>
                    <Text style={styles.temperature}>{weather.temperature}°</Text>
                    <MaterialCommunityIcons name="snowflake" size={100} color="white" />
                </>
            )}
        </View>
    );
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
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        width: '100%',
        paddingBottom: 40,
    },
    button: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
    },
    error: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        margin: 20,
    },
});