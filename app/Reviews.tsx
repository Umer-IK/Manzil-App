import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ProtectedRoute from './components/protectedroute';

const API_BASE_URL = "http://34.226.13.20:3000"; // replace with actual API
  

interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  userProfileImage: string;
}

const STAR_ICON = "★";

const renderStars = (rating: number, setRating?: (value: number) => void) => {
  return (
    <View style={styles.ratingContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => setRating && setRating(star)}>
          <Text style={star <= rating ? styles.starFilled : styles.starEmpty}>{STAR_ICON}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function Reviews() {
  const router = useRouter();
  const { placeName } = useLocalSearchParams<{ placeName: string }>();
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
    loadUsername();
    loadEmail();

  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://34.226.13.20:3000/Reviews?placeName=${placeName}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const loadUsername = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) setUsername(storedUsername);
    } catch (error) {
      console.error('Error loading username:', error);
    }
  };
  const loadEmail = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('email');
      if (storedEmail) setEmail(storedEmail);
    } catch (error) {
      console.error('Error loading username:', error);
    }
  };

  const submitReview = async () => {
    if (!newReview || rating <= 0 || !username) return;

    try {
      await axios.post(`http://34.226.13.20:3000/Reviews`, {
        placeName,
        user: username,
        email: email,
        rating,
        comment: newReview,
      });

      setNewReview('');
      setRating(0);
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <Text style={styles.header}>Reviews of</Text>
        <Text style={styles.header1}>{placeName} </Text>
        <FlatList
          data={reviews}
          keyExtractor={(review) => review.id}
          renderItem={({ item }) => (
            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Image source={{ uri: item.userProfileImage || 'https://via.placeholder.com/40' }} style={styles.profileImage} />
                <Text style={styles.userName}>{item.user}</Text>
              </View>
              {renderStars(item.rating)}
              <Text style={styles.comment}>{item.comment}</Text>
            </View>
          )}
        />
        <Text style={styles.subHeader}>Add a Review</Text>
        <TextInput placeholder="Write your review ..." value={newReview} onChangeText={setNewReview} style={styles.input} />
        {renderStars(rating, setRating)}
        <TouchableOpacity style={styles.submitButton} onPress={submitReview}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'semibold',
    fontFamily: 'Abhaya Libre Medium',
    marginBottom: 5,
    color: '#333',
    marginHorizontal: 'auto',
  },
  header1: {
    fontSize: 28,
    fontFamily: 'montserrat',
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    marginHorizontal: 'auto',
  },
  reviewCard: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 8,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#ccc',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  starFilled: {
    color: '#FFD700',
    fontSize: 27,
    marginRight: 4,
  },
  starEmpty: {
    color: '#D3D3D3',
    fontSize: 27,
    marginRight: 4,
  },
  comment: {
    fontSize: 14,
    color: '#666',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
    width: '90%',
    marginHorizontal: 'auto',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
