import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
  Alert,
  SafeAreaView,
  Dimensions,
  TextInput, Modal,
  Button
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import ProtectedRoute from "./components/protectedroute";
import Footer from "./components/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';


const API_BASE_URL = "url"; // replace with actual url

// Car type colors
const carTypeColors = {
  SUV: "#FFA07A",
  Sedan: "#87CEFA",
  Hatchback: "#A020F0",
  Compact: "#FFD700",
  Luxury: "#DDA0DD",
  Sports: "#FF6347",
  Minivan: "#20B2AA",
  Convertible: "#FF69B4",
  default: "#A8CCF0",
};

const CarRentalDetailsPage = () => {
  const router = useRouter();
  const { rentalId } = useLocalSearchParams();
  interface Company {
    name: string;
    location?: {
      address: string;
      city: string;
    };
    contact_phone?: string;
    contact_email?: string;
    cars?: {
      model: string;
      type: string;
      rent_per_day: number;
      registration_number: string;
      available: boolean;
    }[];
  }

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [cityName, setCityName] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Modal state for car booking
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [cnic, setCnic] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(""); // Default is ONLINE

  // Load email and last city from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("email");
        const lastCity = await AsyncStorage.getItem("lastCity");
        if (storedEmail) setEmail(storedEmail);
        if (lastCity) setCityName(lastCity);
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    
    loadUserData();
  }, []);

  // Fetch car rental company details

  const fetchCompanyDetails = async () => {
      if (!rentalId) {
        setError("No rental company ID provided");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://34.226.13.20:3000/car-rental-companies/${rentalId}`);
        setCompany(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching company details:", error);
        setError("Failed to load company details");
        setLoading(false);
      }
    };

  useEffect(() => {
    
    fetchCompanyDetails();
  }, [rentalId]);

  // Handle booking a car
  interface Car {
    model: string;
    type: string;
    rent_per_day: number;
    registration_number: string;
    available: boolean;
  }
  
  const handleBookCar = (car: Car): void => {
    setSelectedCar(car);
    setBookingModalVisible(true);
  };


 const processBooking = async () => {
  if (!selectedCar) return;

  try {
    const email = await AsyncStorage.getItem('email');

    const payload = {
      cnic,
      contactNumber,
      fromDate,
      endDate: toDate,
      paymentMethod,
      registrationNumber: selectedCar.registration_number,
      rentCarCompanyId: rentalId,
      userEmail: email,
    };

    const response = await axios.post('http://34.226.13.20:3000/book', payload);

    Alert.alert(response.data.message); // 🔥 Show the actual backend message

    setBookingModalVisible(false);
    setCnic('');
    setContactNumber('');
    fetchCompanyDetails();
  } catch (error) {
    console.error("Error booking car:", error);
    Alert.alert("Error", "Failed to book the car. Please try again.");
  }
};



  // Handle back button
  const handleBack = () => {
    router.back();
  };

  // Handle profile navigation
  const handleProfile = () => {
    router.push({
      pathname: "/Profile",
      params: { email, city: cityName },
    });
  };

  // Render car availability badge
  const renderAvailabilityBadge = (available: boolean): JSX.Element => (
    <View style={[styles.availabilityBadge, { backgroundColor: available ? '#4CAF50' : '#F44336' }]}>
      <Text style={styles.availabilityText}>{available ? 'Available' : 'Unavailable'}</Text>
    </View>
  );

  // Get color based on car type
  const getTypeColor = (type: string) => {
      return carTypeColors[type as keyof typeof carTypeColors] || carTypeColors.default;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A8CCF0" />
        <Text>Loading company details...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <ProtectedRoute>
      <Modal visible={bookingModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style ={styles.modalContent}>
            <Text style={styles.modalHeader}>
              Booking Details for {selectedCar?.model}
            </Text>

          <TextInput
            placeholder="CNIC"
            value={cnic}
            onChangeText={setCnic}
            keyboardType="numeric"
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />
          <TextInput
            placeholder="Contact Number"
            value={contactNumber}
            onChangeText={setContactNumber}
            keyboardType="phone-pad"
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />
           {/* Payment Method Picker */}
          <Text style={styles.dateText}>Payment Method:</Text>
            <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 10 }}>
              <Picker
                selectedValue={paymentMethod}
                onValueChange={(itemValue) => setPaymentMethod(itemValue)}
              >
                <Picker.Item label="Online" value="ONLINE" />
                <Picker.Item label="Others" value="OTHERS" />
              </Picker>
            </View>

            {/* From Date Picker */}
            <Text style={styles.dateText}>From Date:</Text>
            <TouchableOpacity onPress={() => setShowFromPicker(true)} style={{ marginBottom: 10 }}>
              <Text style={styles.modalInput}>
                  {fromDate ? fromDate.toDateString() : 'Select Date'}
              </Text>
            </TouchableOpacity>
            {showFromPicker && (
              <DateTimePicker
                value={fromDate}
                mode="date"
                display="default"
                onChange={(e, selectedDate) => {
                  setShowFromPicker(false);
                  if (selectedDate) setFromDate(selectedDate);
                }}
              />
            )}

            {/* To Date Picker */}
            <Text style={styles.dateText}>To Date:</Text>
            <TouchableOpacity onPress={() => setShowToPicker(true)} style={{ marginBottom: 10 }}>
              <Text style={styles.modalInput}>
                  {toDate ? toDate.toDateString() : 'Select Date'}
              </Text>
            </TouchableOpacity>
            {showToPicker && (
              <DateTimePicker
                value={toDate}
                mode="date"
                display="default"
                onChange={(e, selectedDate) => {
                  setShowToPicker(false);
                  if (selectedDate) setToDate(selectedDate);
                }}
              />
            )}
            <View style={styles.buttonColumn}>
              <TouchableOpacity style={styles.buttonWrapper}>
                <Button title="Confirm Booking" onPress={() => selectedCar && processBooking()} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonWrapper}>
                <Button title="Cancel" onPress={() => setBookingModalVisible(false)} color="gray" color="#FF3B30" />
              </TouchableOpacity>   
            </View>       
          </View>
        </View>
      </Modal>

      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.companyName}>{company?.name}</Text>
    </View>

        <View style={styles.companyInfoCard}>
        
          <Text style={styles.companyAddress}>
            {company?.location?.address}, {company?.location?.city}
          </Text>
          
          {company?.contact_phone && (
            <Text style={styles.contactInfo}>
              <FontAwesome name="phone" size={16} color="#666" /> {company.contact_phone}
            </Text>
          )}
          
          {company?.contact_email && (
            <Text style={styles.contactInfo}>
              <FontAwesome name="envelope" size={16} color="#666" /> {company.contact_email}
            </Text>
          )}
          
        </View>

        <View style={styles.carsHeader}>
            <Text style={styles.carsTitle}>
                Available Cars ({company?.cars?.filter(car => car.available).length || 0}/{company?.cars?.length || 0})
            </Text>
        </View>
        <View style={{marginBottom: 360}}>
          <FlatList
            data={company?.cars}
            keyExtractor={(item) => item.registration_number}
            renderItem={({ item }) => (
              <View style={styles.carCard}>
                <View style={styles.carInfoContainer}>
                  <View style={styles.carBasicInfo}>
                    <Text style={styles.carModel}>{item.model}</Text>
                    <View 
                      style={[styles.carTypeBadge, { backgroundColor: getTypeColor(item.type) }]}
                    >
                      <Text style={styles.carTypeText}>{item.type}</Text>
                    </View>
                    {renderAvailabilityBadge(item.available)}
                  </View>
                  
                  <View style={styles.carDetailsContainer}>
                    <Text style={styles.carRegNumber}>
                      Reg #: {item.registration_number}
                    </Text>
                    <Text style={styles.rentPerDay}>
                      PKR {item.rent_per_day} / day
                    </Text>
                  </View>
                  
                  {item.available && (
                    <TouchableOpacity
                      style={styles.bookButton}
                      onPress={() => handleBookCar(item)}
                      disabled={!item.available}
                    >
                      <Text style={styles.bookButtonText}>Book Now</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyListContainer}>
                <Text style={styles.emptyListText}>No cars available at this location</Text>
              </View>
            )}
          />
        </View>
        
      </SafeAreaView>
      
      <Footer
        handleProfile={handleProfile}
        handleBack={handleBack}
        cityName={cityName}
        email={email}
        currentTab={1}  // Set to whichever tab is appropriate
      />
    </ProtectedRoute>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f9f9f9",
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
 
 
  backButtonText: {
    color: '#176FF2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    flex: 1,
  },
  companyInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
 header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between', // Ensures proper spacing
  padding: 16,
  backgroundColor: '#fff',
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
},
backButton: {
  padding: 8,
},
companyName: {
  fontSize: 20,
  fontWeight: '600',
  color: '#176FF2',
  textAlign: 'center',
  flex: 1, // Ensures the name takes up available space
},
  companyAddress: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    marginTop: 8,
  },
  contactInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  carsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  carsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    marginRight: 4,
    color: '#176FF2',
  },
  carCard: {
    backgroundColor: '#fffeee',
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  carInfoContainer: {
    flex: 1,
  },
  carBasicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  carModel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  carTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginHorizontal: 6,
  },
  carTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  availabilityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  carDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  carRegNumber: {
    fontSize: 14,
    color: '#666',
  },
  rentPerDay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  bookButton: {
    backgroundColor: '#176FF2',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyListContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyListText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' },
  modalHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalInput: { borderWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 10, borderRadius: 5 },
  dateText: { fontSize: 16, color: '#007bff', marginBottom: 10 },
  buttonWrapper: {borderRadius: 5},
  buttonColumn: {marginTop: 15, padding: 5, gap: 10},
});

export default CarRentalDetailsPage;