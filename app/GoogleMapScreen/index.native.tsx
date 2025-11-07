import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';

const { height } = Dimensions.get('window');
const MAP_HEIGHT = height * 0.65; // Map takes ~65% of screen height

const GOOGLE_API_KEY = "key"; // Replace with your actual API key or use environment variables

type Coordinates = {
  latitude: number;
  longitude: number;
};

export default function GoogleMapScreen() {
  const { placeName } = useLocalSearchParams<{ placeName: string }>();
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [userAddress, setUserAddress] = useState<string>('Fetching location...');
  const [destinationLocation, setDestinationLocation] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Validate placeName
        if (!placeName || placeName.trim() === '') {
          throw new Error('No destination provided');
        }
        console.log('placeName:', placeName);

        // Request location permission
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          setLoading(false);
          return;
        }

        // Get user location
        let location = await Location.getCurrentPositionAsync({});
        const userCoords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserLocation(userCoords);

        // Reverse Geocoding - Get Address
        const geoReverseResponse = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${userCoords.latitude},${userCoords.longitude}&key=${GOOGLE_API_KEY}`
        );
        const geoData = await geoReverseResponse.json();
        if (geoData.status === 'OK' && geoData.results?.length > 0) {
          const address = geoData.results[0].formatted_address;
          setUserAddress(address);
        } else {
          console.warn('Reverse geocoding failed:', geoData);
          setUserAddress('Unknown Location');
        }

        // Geocode destination
        const geoResponse = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(placeName)}&key=${GOOGLE_API_KEY}`
        );
        const geoResponseData = await geoResponse.json();
        console.log('Geocoding response:', geoResponseData);

        if (geoResponseData.status !== 'OK') {
          let errorMessage = 'Location not found';
          if (geoResponseData.status === 'ZERO_RESULTS') {
            errorMessage = `No results found for "${placeName}"`;
          } else if (geoResponseData.status === 'INVALID_REQUEST') {
            errorMessage = 'Invalid request. Please check the destination name.';
          } else if (geoResponseData.status === 'OVER_QUERY_LIMIT') {
            errorMessage = 'API quota exceeded. Please try again later.';
          } else if (geoResponseData.status === 'REQUEST_DENIED') {
            errorMessage = 'API key is invalid or not authorized for Geocoding API.';
          }
          throw new Error(errorMessage);
        }

        if (!geoResponseData.results?.length) {
          throw new Error('No location data returned');
        }

        const destCoords = geoResponseData.results[0].geometry.location;
        const destination = { latitude: destCoords.lat, longitude: destCoords.lng };
        setDestinationLocation(destination);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
        console.error('Error:', errorMessage);
        Alert.alert('Error', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    })();
  }, [placeName]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading map...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Construct Google Maps Embed URL
  const mapUrl = `https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_API_KEY}&origin=${userLocation?.latitude},${userLocation?.longitude}&destination=${destinationLocation?.latitude},${destinationLocation?.longitude}&mode=driving`;

  // HTML content with iframe for WebView
  const injectedHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body, html { margin: 0; padding: 0; height: 100%; width: 100%; }
          iframe { border: none; width: 100%; height: 100%; }
        </style>
      </head>
      <body>
        <iframe
          src="${mapUrl}"
          width="100%"
          height="100%"
          frameborder="0"
          style="border:0;"
          allowfullscreen
        ></iframe>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      {/* WebView to display Google Map */}
      <WebView
        originWhitelist={['*']}
        source={{ html: injectedHtml }}
        style={styles.map}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
          Alert.alert('WebView Error', nativeEvent.description);
        }}
      />

      {/* Bottom Container */}
      <View style={styles.bottomContainer}>
        <Text style={styles.destinationText}>{placeName}</Text>
        <Text style={styles.label}>Your Location</Text>
        <Text style={styles.locationText}>{userAddress}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: MAP_HEIGHT,
  },
  bottomContainer: {
    height: '35%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -2 },
  },
  destinationText: {
    fontSize: 25,
    fontWeight: '600', // Fixed from 'semibold'
    color: '#000',
  },
  label: {
    fontSize: 14,
    color: 'gray',
    marginTop: 75,
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    marginTop: 2,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    padding: 20,
  },
});