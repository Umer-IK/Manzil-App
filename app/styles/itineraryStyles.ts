import { StyleSheet } from "react-native";

const itineraryStyles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "rgb(16, 89, 138)",
  },
  dayTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 5,
    textDecorationLine: "underline",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  accommodation: {
    fontSize: 16,
    fontStyle: "italic",
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
  },
  text: {
    fontSize: 16,
    marginTop: 2,
    marginBottom: 2,
    marginLeft: 10,
  },
});

export default itineraryStyles;
