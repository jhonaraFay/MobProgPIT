// screens/LocationPickerScreen.js
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import { useNavigation, useRoute } from "@react-navigation/native";

import { ThemeContext } from "../context/ThemeContext";

const DEFAULT_CENTER = {
  latitude: 14.5995, // Manila as fallback
  longitude: 120.9842,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const LocationPickerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { styles: themeStyles } = useContext(ThemeContext);

  const { initialCoords, onPick } = route.params || {};

  const [region, setRegion] = useState({
    latitude: initialCoords?.latitude ?? DEFAULT_CENTER.latitude,
    longitude: initialCoords?.longitude ?? DEFAULT_CENTER.longitude,
    latitudeDelta:
      initialCoords?.latitudeDelta ?? DEFAULT_CENTER.latitudeDelta,
    longitudeDelta:
      initialCoords?.longitudeDelta ?? DEFAULT_CENTER.longitudeDelta,
  });

  const handleConfirm = () => {
    const picked = {
      latitude: region.latitude,
      longitude: region.longitude,
    };
    if (typeof onPick === "function") {
      onPick(picked);
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: themeStyles.background },
      ]}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={themeStyles.text}
          />
        </TouchableOpacity>
        <Text
          style={[styles.headerTitle, { color: themeStyles.text }]}
        >
          Pick location
        </Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          style={StyleSheet.absoluteFill}
          initialRegion={region}
          onRegionChangeComplete={setRegion}
        >
          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
          />
        </MapView>
      </View>

      {/* Bottom panel (raised above nav bar) */}
      <View style={styles.bottomPanel}>
        <Text
          style={[
            styles.helperText,
            { color: themeStyles.muted },
          ]}
        >
          Drag the map to the restaurant location, then tap
          {" "}
          <Text style={{ fontWeight: "600" }}>"Save location"</Text>.
        </Text>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirm}
          activeOpacity={0.9}
        >
          <Ionicons name="checkmark" size={18} color="#fff" />
          <Text style={styles.confirmButtonText}>Save location</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LocationPickerScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 4,
    zIndex: 2,
  },
  backButton: {
    padding: 4,
    marginRight: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  mapContainer: {
    flex: 1,
    overflow: "hidden",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  bottomPanel: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 28, // <-- extra bottom padding so it's higher
  },
  helperText: {
    fontSize: 12,
    marginBottom: 12,
  },
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff6247",
    borderRadius: 999,
    paddingVertical: 11,
    marginBottom: 8, // <-- a bit more space from bottom edge
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
});

