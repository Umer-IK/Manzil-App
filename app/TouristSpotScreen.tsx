import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";

const GOOGLE_API_KEY = "key"; // replace with actual key

const TouristSpotScreen = () => {
  const router = useRouter();
  const [spot, setSpot] = useState<{
    name: string;
    description: string;
    image: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const { city, spotName } = useLocalSearchParams();
  const GEMINI_KEY = "key"
  // handlers for back button and navigation button
  const handleBack = (city: string) => {
    router.push({
      pathname: "/home",
      params: { city: `{\"name\":\"${city}\",\"places\":[],\"foods\":[]}` },
    });
  };

  const handleNavigate = (spotName: string) => {
    router.push(`/GoogleMapScreen?placeName=${encodeURIComponent(spotName)}`);
  };

  // Fetch spot details from Google Places API and generate description using Gemini
  useEffect(() => {
    const fetchSpotDetails = async () => {
      try {
        setLoading(true);
        
        // First get the spot details from Google Places API
        const geocodeResponse = await axios.get(
          "https://maps.googleapis.com/maps/api/geocode/json",
          {
            params: {
              address: city,
              key: GOOGLE_API_KEY,
            },
          }
        );

        if (geocodeResponse.data.status !== "OK") {
          throw new Error("City not found");
        }

        const { lat, lng } = geocodeResponse.data.results[0].geometry.location;

        // Search for the specific place by name
        const placesResponse = await axios.get(
          "https://maps.googleapis.com/maps/api/place/textsearch/json",
          {
            params: {
              query: spotName,
              location: `${lat},${lng}`,
              radius: 10000, //10km
              key: GOOGLE_API_KEY,
            },
          }
        );

        if (placesResponse.data.status !== "OK" || !placesResponse.data.results[0]) {
          throw new Error("Tourist spot not found");
        }

        const place = placesResponse.data.results[0];
        const image = place.photos?.[0]?.photo_reference
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
          : "https://via.placeholder.com/400";

        // Generate description using Gemini API
        const prompt = `Provide a 3-4 line engaging description about ${spotName} in ${city} for tourists. Focus on its historical/cultural significance, unique features, and visitor experience.`;
        
        const geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key= ${GEMINI_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: prompt }],
              }],
            }),
          }
        );

        if (!geminiResponse.ok) {
          const errorData = await geminiResponse.json();
          throw new Error(`Gemini API Error: ${errorData.error.message}`);
        }

        const geminiData = await geminiResponse.json();
        const description = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 
          "No description available for this location.";

        setSpot({
          name: spotName as string,
          description,
          image,
        });

      } catch (error) {
        console.error("Error fetching spot details:", error);
        Alert.alert("Error", error.message);
        setSpot({
          name: spotName as string,
          description: "Could not load description for this location.",
          image: "https://via.placeholder.com/400",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSpotDetails();
  }, [city, spotName]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="blue" style={styles.loader} />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => handleBack(city as string)}
      >
        <Image
          source={require("../assets/images/backicon.png")}
          style={styles.backButton}
        />
      </TouchableOpacity>

      {/* Image */}
      <Image source={{ uri: spot?.image }} style={styles.image} />

      {/* Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{spot?.name}</Text>
        <Text style={styles.description}>{spot?.description}</Text>

        {/* Show Map Button */}
        <TouchableOpacity 
          style={styles.button}
          onPress={() => handleNavigate(spot?.name || spotName as string)}
        >
          <Text style={styles.buttonText}>Show Map ➜</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,  // Allows content to scroll
    paddingBottom: 20,  // Adds some space at the bottom
  },
  container: { flex: 1, backgroundColor: "#F8F8F8" },
  backButton: { 
    position: "absolute", 
    top: 20, 
    left: 15, 
    zIndex: 10, 
    height: 40, 
    width: 40,
    borderRadius: 10
  },
  image: {
    width: "90%",
    height: 400,
    borderRadius: 30,
    top: 20,
    left: 20
  },
  detailsContainer: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#222", paddingTop: 40 },
  description: { fontSize: 16, color: "#555", marginVertical: 40 },
  button: {
    backgroundColor: "#2F80ED",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 18, color: "red" },
});

export default TouristSpotScreen;
