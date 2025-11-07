// import React, { useEffect, useState } from "react";
// import { View, Text, ScrollView, Image, ActivityIndicator } from "react-native";
// import { useRouter, useLocalSearchParams } from "expo-router";
// import axios from "axios";
// import styles from "./styles/citystyles";

// export default function CityDetails() {
//   const { cityName } = useLocalSearchParams();
//   const [city, setCity] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCityDetails = async () => {
//       try {
//         const response = await axios.get(`https://d1lxguzc6q41zr.cloudfront.net/api/cities/${cityName}`);
//         setCity(response.data);
//       } catch (error) {
//         console.error(`Error fetching ${cityName} details:`, error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCityDetails();
//   }, [cityName]);

//   if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.cityTitle}>{city.name}</Text>
      
//       <ScrollView>
//         {city.touristSpots.map((spot) => (
//           <View key={spot.name} style={styles.spotCard}>
//             <Image source={{ uri: spot.image }} style={styles.spotImage} />
//             <Text style={styles.spotName}>{spot.name}</Text>
//             <Text style={styles.spotDescription}>{spot.description}</Text>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// }
