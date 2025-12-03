// navigation/AppStack.js
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import DishDetailScreen from "../screens/DishDetailScreen";
import LocationPickerScreen from "../screens/LocationPickerScreen";


import TabNavigator from "./TabNavigator";
import { AuthContext } from "../context/AuthContext";


const Stack = createNativeStackNavigator();


const AppStack = () => {
  const { user } = useContext(AuthContext);


  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* SPLASH ALWAYS FIRST */}
        <Stack.Screen name="Splash" component={SplashScreen} />


        {/* IF NOT LOGGED IN → AUTH SCREENS */}
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          /* IF LOGGED IN → MAIN TABS + DETAIL + LOCATION PICKER */
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen
              name="DishDetail"
              component={DishDetailScreen}
            />
            <Stack.Screen
              name="LocationPicker"
              component={LocationPickerScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default AppStack;



