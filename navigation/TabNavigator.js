// navigation/TabNavigator.js
import React, { useRef, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SearchScreen from "../screens/SearchScreen";
import SettingsScreen from "../screens/SettingsScreen";
import AddDishScreen from "../screens/AddDishScreen";

import { useThemeContext } from "../context/ThemeContext";

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { styles: themeStyles, theme } = useThemeContext();
  const centerScale = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets();

  // Animate center button when focused/unfocused
  useEffect(() => {
    const centerIndex = state.routes.findIndex(
      (r) => r.name === "AddDish"
    );
    if (centerIndex === -1) return;

    const isCenterFocused = state.index === centerIndex;

    Animated.spring(centerScale, {
      toValue: isCenterFocused ? 1.06 : 1,
      useNativeDriver: true,
      friction: 6,
      tension: 140,
    }).start();
  }, [state.index, centerScale]);

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        { paddingBottom: (insets.bottom || 8) * 0.4 },
      ]}
    >
      <BlurView
        intensity={40}
        tint={theme === "dark" ? "dark" : "light"}
        style={[
          styles.tabBar,
          {
            backgroundColor: themeStyles.tabBar,
            marginBottom: (insets.bottom || 8) + 4,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          // Center floating AddDish button
          if (route.name === "AddDish") {
            return (
              <View key={route.key} style={styles.floatingWrapper}>
                <Animated.View
                  style={[
                    styles.floatingInner,
                    {
                      transform: [{ scale: centerScale }],
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={onPress}
                    onLongPress={onLongPress}
                    activeOpacity={0.85}
                    style={styles.floatingTouchable}
                  >
                    <Ionicons name="add" size={30} color="#fff" />
                  </TouchableOpacity>
                </Animated.View>
              </View>
            );
          }

          let iconName = "home-outline";
          if (route.name === "Home") {
            iconName = isFocused ? "home" : "home-outline";
          } else if (route.name === "Search") {
            iconName = isFocused ? "search" : "search-outline";
          } else if (route.name === "Profile") {
            iconName = isFocused ? "person" : "person-outline";
          } else if (route.name === "Settings") {
            iconName = isFocused ? "settings" : "settings-outline";
          }

          const color = isFocused
            ? themeStyles.primary
            : themeStyles.muted;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
              activeOpacity={0.8}
            >
              <Ionicons name={iconName} size={22} color={color} />
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  );
};

const TabNavigator = () => {
  const { styles: themeStyles } = useThemeContext();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
      sceneContainerStyle={{
        backgroundColor: themeStyles.background,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen
        name="AddDish"
        component={AddDishScreen}
        options={{ tabBarLabel: "Add" }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabBar: {
    marginHorizontal: 20,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  floatingWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    top: 5, // raised a bit more so it's clear of the bar
  },
  floatingInner: {
    width: 58,
    height: 58,
    borderRadius: 40,
    backgroundColor: "#ff6247",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ff6247",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 12,
  },
  floatingTouchable: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
