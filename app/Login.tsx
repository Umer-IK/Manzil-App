// app/LoginScreen.tsx
import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import RNPickerSelect from 'react-native-picker-select';

// List of available cities
const cities = [
  { label: 'Islamabad', value: 'Islamabad' },
  { label: 'Karachi', value: 'Karachi' },
  { label: 'Lahore', value: 'Lahore' },
  { label: 'Quetta', value: 'Quetta' },
];

// Function to decode JWT token manually
function decodeJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const router = useRouter();

  const GOOGLE_API_KEY = "key"; // Replaced with actual key

    const checkInternetAccess = async () => {
    try {
      const response = await axios.get('https://www.google.com');
      console.log('Internet is working!');
    } catch (error) {
      console.error('No internet connection', error);
    }
  };

  useEffect(() => {
    // Call this function when the component is mounted
    checkInternetAccess();
  }, []);


  const handleLogin = async () => {
    try {
      console.log('Sending login request with:', { email, password });
      const response = await axios.post('http://34.226.13.20:3000/login', { email, password });

      console.log('Login response:', response.data);

      // console.log(password)
      const { token } = response.data;

      await AsyncStorage.setItem('authToken', token);
      const decodedToken = decodeJwt(token);
      if (!decodedToken) throw new Error('Failed to decode token');

      const { username, role } = decodedToken;
      await AsyncStorage.setItem('username', username);
      await AsyncStorage.setItem('role', role);
      await AsyncStorage.setItem('email', email); //added email for profile

      console.log('Login successful, token and username stored');

      // Show city selection modal
      setShowModal(true);
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };

  const handleSelectCity = async () => {
    if (!selectedCity) {
      Alert.alert('Error', 'Please select a city.');
      return;
    }

    // Match the JSON format from `HomeScreen.tsx`
    const cityData = JSON.stringify({ name: selectedCity, places: [], foods: [] });

    await AsyncStorage.setItem('selectedCity', cityData);
    setShowModal(false);
    router.replace({
    pathname: "/home",
    params: { city: cityData },
  }); // Navigate to home
  };

  const handleUseLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Enable location permissions to use this feature.');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    console.log(`User Location: Lat ${latitude}, Lng ${longitude}`);

    try {
      // Reverse Geocode to get City Name
      const geocodeResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
      );

      if (geocodeResponse.data.status === 'OK') {
        const results = geocodeResponse.data.results;
        let cityName = null;

        // Extract city name from API response
        for (let i = 0; i < results.length; i++) {
          const addressComponents = results[i].address_components;
          for (let j = 0; j < addressComponents.length; j++) {
            if (addressComponents[j].types.includes('locality')) {
              cityName = addressComponents[j].long_name;
              break;
            }
          }
          if (cityName) break;
        }

        if (!cityName) {
          Alert.alert('Location Error', 'Could not determine city from location.');
          return;
        }

        console.log('Detected City:', cityName);

        // Match the JSON format from `HomeScreen.tsx`
        const cityData = JSON.stringify({ name: cityName, places: [], foods: [] });

        // Save and navigate
        await AsyncStorage.setItem('selectedCity', cityData);
        setShowModal(false);
        router.replace({
        pathname: "/home",
        params: { city: cityData },
      });
      } else {
        Alert.alert('Error', 'Could not retrieve city name.');
      }
    } catch (error) {
      console.error('Error fetching city name:', error);
      Alert.alert('Error', 'Failed to get city name from location.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Continue thy Journey</Text>

      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      </View>

      <TouchableOpacity style={styles.button1} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      {/* City Selection Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select Your Location</Text>

            <RNPickerSelect
              onValueChange={setSelectedCity}
              items={cities}
              style={{ inputIOS: styles.input1, inputAndroid: styles.input1 }}
              placeholder={{ label: 'Select a city...', value: '' }}
            />
            <TouchableOpacity style={styles.button} onPress={handleSelectCity}>
              <Text style={styles.buttonText}>Confirm Selection</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button2} onPress={handleUseLocation}>
              <Text style={styles.buttonText}>Allow Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles remain **unchanged** as per your request
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: '#f4f4f4' },
  
  headerText: {     fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 80,
     color: 'rgb(17, 90, 138)'},
  
  inputContainer: { width: '100%', marginBottom: 30 },
  
  input: { backgroundColor: '#fff', borderRadius: 20, paddingVertical: 12, paddingHorizontal: 16, marginBottom: 15, fontSize: 16, width: '100%' },

  input1: { backgroundColor: '#f8f3f3', borderRadius: 70, paddingVertical: 12, paddingHorizontal: 16, marginBottom: 20, fontSize: 16, width: '100%' },

  button: { backgroundColor: '#007AFF', paddingVertical: 12, gap: 8, paddingHorizontal: 40, borderRadius: 25, marginTop: 10, alignItems: 'center', width: '80%' },

  button1: { backgroundColor: '#007AFF', paddingVertical: 12, gap: 8, paddingHorizontal: 40, borderRadius: 25, marginTop: 10, alignItems: 'center', width: '80%' },

  button2: { backgroundColor: '#007AFF', paddingVertical: 15, gap: 8, paddingHorizontal: 40, borderRadius: 25, marginTop: 20, alignItems: 'center', width: '80%' },

  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600', fontFamily: 'montserrat' },
  
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%', alignItems: 'center' },
  
  modalHeader: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
});