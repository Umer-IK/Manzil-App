import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Dimensions,
  Alert,
  Image,
  FlatList,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import ProtectedRoute from "./components/protectedroute";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "./styles/profilestyles";
import Footer from "./components/Footer";
import { ScrollView } from "react-native";
import Constants from "expo-constants";
import Reviews from './Reviews';

const API_BASE_URL ="http://34.226.13.20:3000"; // replace with actual url

interface Review {
  _id: string;
  user: string;
  rating: number;
  comment: string;
  placeName: string;
}
interface Reservation {
  _id: string;
  hotel_ID: {
    _id: string;
    hotel_name: string;
  };
  reservationStatus: string;
  createdAt: string;
  reservation_date: { 
    from: string,
    to: string,   
  };
  hotel_name: string;
}
interface Rental {
  _id: string,
  carModel: string,
  registrationNumber: string,
  fromDate: string,
  endDate: string,
  rentCarCompany: {
    name: string,
    address: string
    contact_phone: string
    location: {
      address: string
    }
  }
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

export default function Profile() {
  const router = useRouter();
  
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("updateProfile");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const { email, city } = useLocalSearchParams(); // Get params from URL
  const [errorMessage, setErrorMessage] = useState("");

  // Load user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("email");
        const response = await axios.get(`http://34.226.13.20:3000/api/user/?email=${storedEmail}`);
        setUserData(response.data);
        setConfirmPassword(userData.password);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

// load Reviews
  useEffect(() => {
    if (activeTab !== "reviews" || !userData?.email) return;
    setLoading(true);
    axios
      .get(`http://34.226.13.20:3000/api/Reviews/?email=${userData.email}`)
      .then((response) => {
        if (response.data) {
          setReviews(response.data);
        } else {
          setReviews([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
        setReviews([]);
        setLoading(false);
      });
  }, [activeTab, userData.email]);
  
  // load Car rentals
  useEffect(() => {
    if (activeTab !== "rentals" || !userData?.email) return;
    setLoading(true);
    axios
      .get(`http://34.226.13.20:3000/api/user-car-rentals/?email=${userData.email}`)
      .then((response) => {
        if (response.data) {
          setRentals(response.data);
        } else {
          setRentals([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching rentals:", error);
        setRentals([]);
        setLoading(false);
      });
  }, [activeTab, userData.email]);
  
  // load Reservations
  useEffect(() => {
    if (activeTab !== "reservations" || !userData?.email) return;
    setLoading(true);
    axios
      .get(`http://34.226.13.20:3000/api/reservations-by-email/?email=${userData.email}`)
      .then((response) => {
        if (response.data) {
          setReservations(response.data);
        } else {
          setReservations([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reservations:", error);
        setReservations([]);
        setLoading(false);
      });
  }, [activeTab, userData.email]);
  
  // handler for homepage routing
  const handleBack = (city: string) => {
    // Make sure we have a valid city or use a default
    const cityParam = city && city !== "undefined" 
      ? `{\"name\":\"${city}\",\"places\":[],\"foods\":[]}` 
      : userData.lastCity || "{\"name\":\"Islamabad\",\"places\":[],\"foods\":[]}";
      
    router.push({
      pathname: "/home",
      params: { city: cityParam },
    });
  };
    
  // Handle updating the profile.
  const handleUpdateProfile = async () => {
    setErrorMessage('');

    if (userData.password !== confirmPassword) {
      setErrorMessage("Passwords don't match");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(userData.email)) {
      setErrorMessage('Invalid email format');
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(userData.password)) {
      setErrorMessage(
        'Password must have at least 8 characters, one capital letter, and one special character'
      );
      return;
    }
    try {
      const response = await axios.put(
        `http://34.226.13.20:3000/user/?email=${userData.email}`,
        userData
      );
      //console.log(response.data);
      Alert.alert("Success", "Profile updated successfully!");
      // Assuming the backend returns the updated profile data in response.data.updatedProfile
      const updatedProfile = response.data.updatedProfile;
      // Update the state.
      setUserData(updatedProfile);
      setConfirmPassword(updatedProfile.password);
      // Update AsyncStorage with new values.
      await AsyncStorage.setItem("username", updatedProfile.username);
      await AsyncStorage.setItem("email", updatedProfile.email);
    } catch (error: unknown) {
      let errorMessage = "Profile update failed!";
      if (axios.isAxiosError(error)) {
        errorMessage =
          (error.response && error.response.data) || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Error updating profile:", errorMessage);
      Alert.alert("Error", errorMessage);
    }
  };

  // Render content based on the active tab.
  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#A8CCF0" />;
    }
    if (activeTab === "updateProfile") {
      return (
        <View style={{ padding: 20, marginTop:30 }}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={userData.username}
            onChangeText={(text) =>
              setUserData((prev) => ({ ...prev, username: text }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={userData.email}
            onChangeText={(text) =>
              setUserData((prev) => ({ ...prev, email: text }))
            }
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={userData.password}
            onChangeText={(text) =>
              setUserData((prev) => ({ ...prev, password: text }))
            }
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) =>
              setConfirmPassword(text)
            }
            secureTextEntry
          />
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
          <TouchableOpacity
            style={styles.button3}

            onPress={handleUpdateProfile}
          >
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (activeTab === "reservations") {
      return (
        <View style={styles.reviews_container}>
          <View style={{ marginTop: 15, padding: 5, marginBottom: 10 }}>
            <Text style= {styles.sectionTitle_review}>Your reservations:</Text>
          </View>
          <View style = {{marginBottom: 120}}>
            <FlatList showsVerticalScrollIndicator={false}
              data={reservations}
              keyExtractor={(reservation) => reservation._id}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.hotelPlaceName}>{item.hotel_ID?.hotel_name ?? 'Unknown Hotel'}</Text>
                  <Text style={styles.hotelDetails}>Status: {item.reservationStatus}</Text>
                  <Text style={styles.hotelDetails}>{'From: ' + item.reservation_date.from.slice(0, 10)}</Text>
                  <Text style={styles.hotelDetails}>{'To: ' + item.reservation_date.to.slice(0, 10)}</Text>
                  <Text style={styles.hotelDetails}>{'Created at: ' + item.createdAt.slice(0, 10)}</Text>
                </View>
              )}
            /> 
          </View>
        </View>
      );
    } else if (activeTab === "reviews") {
      return (
        <View style={styles.reviews_container}>
          <View style={{ marginTop: 15, padding: 5, marginBottom: 10 }}>
            <Text style= {styles.sectionTitle_review}>Your experiences:</Text>
          </View> 
          <View style = {{marginBottom: 130}}>
            <FlatList showsVerticalScrollIndicator={false}
              data={reviews}
              keyExtractor={(review) => review._id}
              renderItem={({ item }) => (
                <View style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.userName}>{item.placeName}</Text>
                  </View>
                  {renderStars(item.rating)}
                  <Text style={styles.hotelDetails}>{item.comment}</Text>
                </View>
              )}
            />
          </View>
        </View>
      );
    } else if (activeTab === "rentals") {
      return (
        <View style={styles.reviews_container}>
          <View style={{ marginTop: 15, padding: 5, marginBottom: 10 }}>
            <Text style= {styles.sectionTitle_review}>Your car rental bookings:</Text>
          </View> 
          <View style = {{marginBottom: 130}}>
            <FlatList showsVerticalScrollIndicator={false}
              data={rentals}
              keyExtractor={(rental) => rental._id}
              renderItem={({ item }) => (
                <View style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.hotelPlaceName}>{item.rentCarCompany.name}</Text>
                  </View>
                  <Text style={styles.hotelDetails}>Model: {item.carModel}</Text>
                  <Text style={styles.hotelDetails}>Registration number: {item.registrationNumber}</Text>
                  <Text style={styles.hotelDetails}>From: {item.fromDate.slice(0, 10)}</Text>
                  <Text style={styles.hotelDetails}>To: {item.endDate.slice(0, 10)}</Text>
                  <Text style={styles.hotelDetails}>Rental address: {item.rentCarCompany.location.address}</Text>
                  <Text style={styles.hotelDetails}>Rental contact: {item.rentCarCompany.contact_phone}</Text>
                </View>
              )}
            />
          </View>
        </View>
      );
    }
  };

return (
  <ProtectedRoute>
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Hi <Text style={styles.sectionTitle2}>{userData.username}!</Text></Text>
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => router.push('/')}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
        {/* Tiny "My Trips" button */}
        <TouchableOpacity
          style={styles.myTripsButton}
          onPress={() => router.push("/mytrips")}
        >
          <Text style={styles.myTripsButtonText}>View my trips</Text>
        </TouchableOpacity>
      
        {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScrollView}> */}
          <View style = {styles.tabsContainer}>
            <TouchableOpacity
              style={activeTab === "updateProfile" ? styles.activeTab : styles.inactiveTab}
              onPress={() => setActiveTab("updateProfile")}
            >
              <Text style={activeTab === "updateProfile" ? styles.activeTabText : styles.inactiveTabText}>
                Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={activeTab === "reservations" ? styles.activeTab : styles.inactiveTab}
              onPress={() => setActiveTab("reservations")}
            >
              <Text style={activeTab === "reservations" ? styles.activeTabText : styles.inactiveTabText}>
                Reservations
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={activeTab === "rentals" ? styles.activeTab : styles.inactiveTab}
              onPress={() => setActiveTab("rentals")}
            >
              <Text style={activeTab === "rentals" ? styles.activeTabText : styles.inactiveTabText}>
                Rentals
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={activeTab === "reviews" ? styles.activeTab : styles.inactiveTab}
              onPress={() => setActiveTab("reviews")}
            >
              <Text style={activeTab === "reviews" ? styles.activeTabText : styles.inactiveTabText}>
                Reviews
              </Text>
            </TouchableOpacity>
          </View> 
        {/* </ScrollView>       */}
      {renderContent()} 
    </View>
    
    <Footer
      handleProfile={()=>{
        console.log("Already on Profile")
      }}
      handleBack={handleBack}
      cityName={city as string}
      email={email as string}
      currentTab={2}
    />
  </ProtectedRoute>

);}