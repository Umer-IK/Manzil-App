// app/TripDetails.tsx
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, ActivityIndicator } from "react-native";
import itineraryStyles from "./styles/itineraryStyles";

export default function TripDetailsScreen() {
  const params = useLocalSearchParams();
  let itineraryData: { content?: string } | null = null;

  // The itinerary is passed as a JSON string (via mytrips.tsx) 
  if (params.itinerary) {
    try {
      itineraryData = JSON.parse(params.itinerary);
    } catch (error) {
      console.error("Error parsing itinerary parameter:", error);
    }
  }

  const renderFormattedItinerary = () => {
    if (!itineraryData || !itineraryData.content) return null;
    // Remove any asterisks and split by newlines
    const cleanedItinerary = itineraryData.content.replace(/\*/g, "");
    const lines = cleanedItinerary.split("\n");

    return lines.map((line, index) => {
      const cleanedLine = line.trim();
      if (/^Day\s*\d+/i.test(cleanedLine)) {
        return (
          <Text key={index} style={itineraryStyles.dayTitle}>
            {cleanedLine}
          </Text>
        );
      } else if (/(morning|afternoon|evening)/i.test(cleanedLine)) {
        return (
          <Text key={index} style={itineraryStyles.sectionTitle}>
            {cleanedLine}
          </Text>
        );
      } else if (cleanedLine.toLowerCase().includes("accommodation:")) {
        return (
          <Text key={index} style={itineraryStyles.accommodation}>
            {cleanedLine}
          </Text>
        );
      } else {
        return (
          <Text key={index} style={itineraryStyles.text}>
            {cleanedLine}
          </Text>
        );
      }
    });
  };

  return (
    <ScrollView style={itineraryStyles.container}>
      <Text style={itineraryStyles.title}>Trip Details</Text>
      {itineraryData && itineraryData.content ? (
        renderFormattedItinerary()
      ) : (
        <ActivityIndicator size="large" />
      )}
    </ScrollView>
  );
}
