import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import Constants from "expo-constants";

const API_BASE_URL = "http://34.226.13.20:3000" ;

import { Ionicons } from '@expo/vector-icons';

export default function MyTripsScreen() {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Function to load itineraries for the logged-in user
  const loadItineraries = async () => {
    setLoading(true);
    try {
      // Retrieve the unique username stored during login
      const username = await AsyncStorage.getItem('username');
      if (!username) {
        Alert.alert('Error', 'User not found. Please log in again.');
        setLoading(false);
        return;
      }

      // Call backend endpoint to get itineraries by username
      const response = await axios.get(
        `http://34.226.13.20:3000/itinerary/my?username=${username}`
      );
      setItineraries(response.data);
    } catch (error) {
      console.error('Error loading itineraries:', error.message);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItineraries();
  }, []);

  // Handler when a user taps an itinerary: navigate to details page.
  const handleItineraryPress = (itinerary) => {
    router.push({
      pathname: '/TripDetails',
      params: {
        itinerary: JSON.stringify(itinerary),
      },
    });
  };

  // Handler for "Create New Itinerary" button: navigates to trip create page.
  const handleCreateNew = () => {
    router.push('/trip-create');
  };

  // Navigate back to Profile screen
const handleBackPress = async () => {
  try {
    const storedCity = await AsyncStorage.getItem('lastCity');
    router.push({
      pathname: '/Profile',
      params: { city: storedCity }
    });
  } catch (error) {
    console.error("Error retrieving city:", error);
    router.push('/Profile');
  }
};

  // Render each itinerary item
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleItineraryPress(item)}
    >
      <Text style={styles.itemTitle}>{item.name}</Text>
      <Text numberOfLines={2} style={styles.itemContent}>
        {item.content}
      </Text>
      <Text style={styles.itemDate}>
        Created: {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Ionicons name="arrow-back" size={24} color="rgb(56, 123, 167)" />
      </TouchableOpacity>
      <Text style={styles.header}>My Trips</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : itineraries.length === 0 ? (
        <Text style={styles.noTripsText}>No itineraries found.</Text>
      ) : (
        <FlatList
          data={itineraries}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <TouchableOpacity style={styles.createButton} onPress={handleCreateNew}>
        <Text style={styles.createButtonText}>Create New Itinerary</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 15,
    zIndex: 10,
    borderWidth: 2,
    borderColor: 'rgb(56, 123, 167)',
    borderRadius: 10,
    padding: 6,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    marginTop: 20,
    textAlign: 'center',
    fontFamily: 'serif',
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemContent: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  itemDate: {
    fontSize: 14,
    color: '#888',
  },
  noTripsText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 28,
    fontFamily: 'monospace',
  },
  createButton: {
    backgroundColor: 'rgb(56, 123, 167)',
    padding: 15,
    borderRadius: 35,
    alignItems: 'center',
    marginTop: 15,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
