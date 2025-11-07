import React from 'react';
import { View, StyleSheet,Text } from 'react-native';
import { Stack } from 'expo-router';
import { AuthProvider } from './contexts/authcontext';  // Adjusted path
import Header from './components/Header';  // Adjusted path
import { MenuProvider } from 'react-native-popup-menu';

export default function RootLayout() {
  return (
    <MenuProvider>
      <AuthProvider>
        <View style={styles.container}>
          {/* <Header />  Uncomment if needed */}
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </AuthProvider>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
