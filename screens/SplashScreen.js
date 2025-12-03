// screens/SplashScreen.js
import React, { useEffect, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

const SplashScreen = ({ navigation }) => {
  const { styles: themeStyles } = useContext(ThemeContext) || {};
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        navigation.replace("MainTabs");
      } else {
        navigation.replace("Login");
      }
    }, 1800); // ~1.8s

    return () => clearTimeout(timer);
  }, [navigation, user]);

  const bg = themeStyles?.background || "#050505";
  const textColor = themeStyles?.text || "#f9f9f9";
  const muted = themeStyles?.muted || "#9a9a9a";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      {/* Center content */}
      <View style={styles.center}>
        {/* Logo + app name block */}
        <View style={styles.logoStack}>
          <View style={styles.logoCircleOuter}>
            <View style={styles.logoCircleInner}>
              <Ionicons name="fast-food-outline" size={40} color="#fff" />
            </View>
          </View>

          <View style={styles.titleBlock}>
            <Text style={[styles.appName, { color: textColor }]}>
              Dishcovery
            </Text>
            <Text style={[styles.subtitle, { color: muted }]}>
              Discover nearby eats &amp; dishes
            </Text>
          </View>
        </View>

        {/* Lottie preloader */}
        <View style={styles.lottieWrapper}>
          <LottieView
            source={require("../assets/lottie-loading.json")}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>

        {/* Small pill with group info */}
        <View style={styles.devPill}>
          <Ionicons name="people-outline" size={14} color={muted} />
          <Text style={[styles.devPillText, { color: muted }]}>
            Developed by Group 6
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.versionText, { color: muted }]}>
          v1.0.0 · Demo build
        </Text>
        <Text style={[styles.madeWithText, { color: muted }]}>
          Made with ❤️ using React Native &amp; Expo
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoStack: {
    alignItems: "center",
  },
  logoCircleOuter: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: "rgba(255, 98, 71, 0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  logoCircleInner: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#ff6247",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ff6247",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  titleBlock: {
    alignItems: "center",
    marginTop: 4,
  },
  appName: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
  },
  lottieWrapper: {
    marginTop: 28,
    width: 130,
    height: 130,
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
  devPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.16)",
    marginTop: 22,
  },
  devPillText: {
    fontSize: 11,
    marginLeft: 6,
  },
  footer: {
    alignItems: "center",
    paddingBottom: 14,
  },
  versionText: {
    fontSize: 11,
  },
  madeWithText: {
    fontSize: 11,
    marginTop: 2,
  },
});
