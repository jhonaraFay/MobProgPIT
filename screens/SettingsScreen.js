// screens/SettingsScreen.js
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

const SettingsScreen = () => {
  const { theme, toggleTheme, styles: themeStyles } =
    useContext(ThemeContext) || {};
  const { user, logout } = useContext(AuthContext);

  // Collapsible states
  const [notifOpen, setNotifOpen] = useState(false);
  const [appOpen, setAppOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  // Fake switches
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);

  const displayName =
    user?.displayName || user?.username || "User";
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const avatarUri = user?.avatarUri || null;

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: themeStyles?.background || "#000" },
      ]}
    >
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Header with avatar */}
        <View style={styles.headerRow}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarLetter}>
              <Text style={styles.avatarLetterText}>
                {avatarInitial}
              </Text>
            </View>
          )}
          <View>
            <Text
              style={[
                styles.name,
                { color: themeStyles?.text || "#fff" },
              ]}
            >
              {displayName}
            </Text>
            <Text style={{ color: themeStyles?.muted || "#aaa" }}>
              @{(user?.username || "user").toLowerCase()}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text
          style={[
            styles.title,
            { color: themeStyles?.text || "#fff" },
          ]}
        >
          Settings
        </Text>

        {/* NOTIFICATION SETTINGS */}
        <TouchableOpacity
          onPress={() => setNotifOpen(!notifOpen)}
          style={[
            styles.sectionHeader,
            { backgroundColor: themeStyles?.card || "#111" },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: themeStyles?.text || "#fff" },
            ]}
          >
            Notifications
          </Text>
          <Text style={styles.arrow}>{notifOpen ? "▲" : "▼"}</Text>
        </TouchableOpacity>

        {notifOpen && (
          <View style={styles.sectionContent}>
            <View style={styles.switchRow}>
              <Text
                style={[
                  styles.switchLabel,
                  { color: themeStyles?.text || "#fff" },
                ]}
              >
                Push Notifications
              </Text>
              <Switch value={pushNotif} onValueChange={setPushNotif} />
            </View>

            <View style={styles.switchRow}>
              <Text
                style={[
                  styles.switchLabel,
                  { color: themeStyles?.text || "#fff" },
                ]}
              >
                Email Alerts
              </Text>
              <Switch value={emailNotif} onValueChange={setEmailNotif} />
            </View>
          </View>
        )}

        {/* APP SETTINGS */}
        <TouchableOpacity
          onPress={() => setAppOpen(!appOpen)}
          style={[
            styles.sectionHeader,
            { backgroundColor: themeStyles?.card || "#111" },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: themeStyles?.text || "#fff" },
            ]}
          >
            App Settings
          </Text>
          <Text style={styles.arrow}>{appOpen ? "▲" : "▼"}</Text>
        </TouchableOpacity>

        {appOpen && (
          <View style={styles.sectionContent}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: themeStyles?.card || "#111" },
              ]}
              onPress={toggleTheme}
            >
              <Text style={{ color: themeStyles?.text || "#fff" }}>
                Switch to {theme === "light" ? "Dark" : "Light"} Mode
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: themeStyles?.card || "#111" },
              ]}
            >
              <Text style={{ color: themeStyles?.text || "#fff" }}>
                Clear Cache
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: themeStyles?.card || "#111" },
              ]}
            >
              <Text style={{ color: themeStyles?.text || "#fff" }}>
                Reset App Data
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ABOUT */}
        <TouchableOpacity
          onPress={() => setAboutOpen(!aboutOpen)}
          style={[
            styles.sectionHeader,
            { backgroundColor: themeStyles?.card || "#111" },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: themeStyles?.text || "#fff" },
            ]}
          >
            About
          </Text>
          <Text style={styles.arrow}>{aboutOpen ? "▲" : "▼"}</Text>
        </TouchableOpacity>

        {aboutOpen && (
          <View style={styles.sectionContent}>
            <Text
              style={[
                styles.aboutText,
                { color: themeStyles?.text || "#fff" },
              ]}
            >
              Dishcovery v1.0.0
            </Text>
            <Text
              style={[
                styles.aboutText,
                { color: themeStyles?.muted || "#aaa" },
              ]}
            >
              Created for demo and educational purposes.
            </Text>
            <Text
              style={[
                styles.aboutText,
                { color: themeStyles?.muted || "#aaa", marginTop: 4 },
              ]}
            >
              Developed by: Group 6
            </Text>
            <Text
              style={[
                styles.aboutText,
                { color: themeStyles?.muted || "#aaa", marginTop: 2 },
              ]}
            >
              Made with ❤️ using React Native & Expo.
            </Text>
          </View>
        )}

        {/* LOGOUT BUTTON */}
        <TouchableOpacity
          style={[styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  avatarLetter: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ff6247",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarLetterText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },

  sectionHeader: {
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  arrow: {
    fontSize: 16,
    color: "#888",
  },

  sectionContent: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 6,
  },

  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },

  switchLabel: {
    fontSize: 16,
  },

  aboutText: {
    fontSize: 14,
    marginBottom: 6,
  },

  logoutButton: {
    backgroundColor: "#ff4b4b",
    paddingVertical: 14,
    marginTop: 30,
    borderRadius: 12,
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
