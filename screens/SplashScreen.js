// SplashScreen.js snippet
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login'); // automatically move to Login
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Text>Welcome to Dishcovery!</Text>
    </View>
  );
};

export default SplashScreen;
