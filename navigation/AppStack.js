import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ProfileScreen from "../screens/ProfileScreen";

import { AuthContext } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

const AppStack = () => {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          // Auth flow
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          </>
        ) : (
          // App flow
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: "Dishes", headerStyle: { backgroundColor: "#ff6247" }, headerTintColor: "#fff" }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ title: "Settings", headerStyle: { backgroundColor: "#ff6247" }, headerTintColor: "#fff" }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ title: "Profile", headerStyle: { backgroundColor: "#ff6247" }, headerTintColor: "#fff" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppStack;
