import React, { useRef, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import LottieView from "lottie-react-native";

import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SearchScreen from "../screens/SearchScreen";
import SettingsScreen from "../screens/SettingsScreen";
import AddDishScreen from "../screens/AddDishScreen";

import { useThemeContext } from "../context/ThemeContext";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarBackground: () => (
          <BlurView intensity={80} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
        ),
        tabBarStyle: {
          position: "absolute",
          bottom: 14,
          left: 20,
          right: 20,
          height: 75,
          borderRadius: 35,
          overflow: "hidden",
          borderTopWidth: 0,
          backgroundColor: "transparent",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <GlowIcon name="home" focused={focused} /> }}
      />

      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ tabBarIcon: ({ focused }) => <GlowIcon name="search" focused={focused} /> }}
      />

      <Tab.Screen
        name="AddDish"
        component={AddDishScreen}
        options={{ tabBarButton: (props) => <FloatingButton {...props} /> }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ focused }) => <GlowIcon name="person" focused={focused} /> }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarIcon: ({ focused }) => <GlowIcon name="settings" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}

/* Glow Icon */
const GlowIcon = ({ name, focused }) => {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(glowAnim, {
      toValue: focused ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  const scale = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.6] });
  const shadowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.35] });

  return (
    <Animated.View style={[styles.glowContainer, { transform: [{ scale }], shadowOpacity, shadowRadius: 12, shadowColor: "#ff6247" }]}>
      <Ionicons name={name} size={28} color={focused ? "#ff6247" : "#888"} />
    </Animated.View>
  );
};

/* Floating Add Button */
const FloatingButton = ({ onPress }) => {
  const animation = useRef(null);

  const handlePress = () => {
    animation.current?.play(0, 60);
    if (onPress) onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={styles.floatingWrapper}>
      <View style={styles.floatingInner}>
        <LottieView ref={animation} source={require("../assets/add-button.json")} autoPlay={false} loop={false} style={{ width: 70, height: 70 }} />
      </View>
    </TouchableOpacity>
  );
};

/* Styles */
const styles = StyleSheet.create({
  glowContainer: {
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 0 },
  },
  floatingWrapper: {
    top: -30,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingInner: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "#ff6247",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ff6247",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 10,
  },
});
