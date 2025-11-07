import React from 'react';
import { Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function Index() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../assets/images/BackGroundImageHomeScreen.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* Logo/Header */}
        <Text style={styles.headerText}>MANZIL</Text>

        {/* Tagline */}
        <View style={styles.taglineContainer}>
          <Text style={styles.subtitle}>Plan your</Text>
          <Text style={styles.subtitleBold}>Trip <Text style={styles.subtitle}>the <Text style={styles.subtitleBold}>Right </Text></Text></Text>
            <Text style={styles.subtitleBold}>Way</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.button, styles.leftButton]} onPress={() => router.push('/Login')}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.rightButton]} onPress={() => router.push('/SignupScreen')}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Adjust overlay darkness
    paddingHorizontal: 20,
  },
  headerText: {
    position: 'absolute',
    top: '25%',
    fontSize: 58,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'serif',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  taglineContainer: {
    position: 'absolute',
    left: 30,
    top: '66%',
    fontFamily: 'montserrat',
  },
  subtitle: {
    fontSize: 21,
    color: '#fff',
    textAlign: 'left',
  },
  subtitleBold: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'left',
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 40,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'Abhaya Libre Medium',
  },
  leftButton: {
    alignSelf: 'flex-start',
  },
  rightButton: {
    alignSelf: 'flex-end',
  },
});
