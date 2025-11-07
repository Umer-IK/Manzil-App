import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import Constants from "expo-constants";

const API_BASE_URL ="http://34.226.13.20:3000"; // replace with actual url
  

interface Location {
  address: string;
  city: string;
  country: string;
}

interface Hotel {
  hotel_name: string;
  location: Location;
  description: string;
}

const HotelsList: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get(`http://34.226.13.20:3000/hotels`);  
        setHotels(response.data);
        
      } catch (error) {
        setError('Error fetching hotels');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={hotels}
        keyExtractor={(item) => item.hotel_name}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.hotelName}>{item.hotel_name}</Text>
            <Text>{item.location.city}, {item.location.country}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
  },
  hotelName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default HotelsList;