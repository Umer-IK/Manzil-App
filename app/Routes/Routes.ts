export type RootStackParamList = {
  index: undefined;
  LoginScreen: undefined;
  SignupScreen: undefined;
  Home: undefined;
  CityScreen: { city: { name: string; places: string[]; foods: string[]; } };
  GoogleMap: { placeName: string };  // Type for Google Map screen
  Reviews: { placeName: string };   // Type for Reviews screen
  ReservationScreen: { placeName: string };
  CarRental: { username: string }; // Type for HotelAdmin screen, where username is passed
  TouristSpotScreen: {spotName: string};
};
