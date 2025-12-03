// screens/HomeScreen.js
import React, {
  useContext,
  useMemo,
  useCallback,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { DishContext } from "../context/DishContext";
import { ThemeContext } from "../context/ThemeContext";
import { LocationContext } from "../context/LocationContext";
import { AuthContext } from "../context/AuthContext";
import DishCard from "../components/DishCard";

// Haversine distance in km
const toRad = (deg) => (deg * Math.PI) / 180;
const distanceKm = (lat1, lon1, lat2, lon2) => {
  if (
    lat1 == null ||
    lon1 == null ||
    lat2 == null ||
    lon2 == null
  ) {
    return null;
  }

  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const HomeScreen = () => {
  const navigation = useNavigation();

  const { dishes } = useContext(DishContext);
  const { styles: themeStyles } = useContext(ThemeContext);
  const { location, status, error, requestLocation } =
    useContext(LocationContext);
  const { user } = useContext(AuthContext);

  const [feedFilter, setFeedFilter] = useState("all"); // "all" | "mine"

  // Attach distance and sort by distance (if location available)
  const sortedDishes = useMemo(() => {
    if (!dishes || dishes.length === 0) return [];

    if (!location) {
      return dishes;
    }

    return dishes
      .map((d) => {
        const dKm = distanceKm(
          location.latitude,
          location.longitude,
          d.latitude,
          d.longitude
        );
        return {
          ...d,
          distanceKm: dKm,
        };
      })
      .sort((a, b) => {
        const ad =
          typeof a.distanceKm === "number"
            ? a.distanceKm
            : Number.POSITIVE_INFINITY;
        const bd =
          typeof b.distanceKm === "number"
            ? b.distanceKm
            : Number.POSITIVE_INFINITY;
        return ad - bd;
      });
  }, [dishes, location]);

  // Apply filter: "For you" vs "My posts"
  const filteredFeed = useMemo(() => {
    if (feedFilter !== "mine") {
      return sortedDishes;
    }

    if (!user?.username) {
      return sortedDishes;
    }

    return sortedDishes.filter(
      (d) =>
        !d.ownerUsername || d.ownerUsername === user.username
    );
  }, [sortedDishes, feedFilter, user]);

  const handlePressLocation = useCallback(() => {
    if (requestLocation) {
      requestLocation();
    }
  }, [requestLocation]);

  const renderItem = ({ item }) => (
    <DishCard
      dish={item}
      onPress={() =>
        navigation.navigate("DishDetail", { dishId: item.id })
      }
    />
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: themeStyles.background },
      ]}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text
            style={[
              styles.headerTitle,
              { color: themeStyles.text },
            ]}
          >
            Dishcovery
          </Text>
          <Text
            style={[
              styles.headerSubtitle,
              { color: themeStyles.muted },
            ]}
          >
            Restaurants & dishes near you
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.locationChip,
            {
              borderColor: themeStyles.border,
              backgroundColor: themeStyles.card,
            },
          ]}
          onPress={handlePressLocation}
          activeOpacity={0.8}
        >
          {status === "requesting" ? (
            <ActivityIndicator size="small" />
          ) : (
            <>
              <Ionicons
                name={location ? "navigate" : "navigate-outline"}
                size={16}
                color={themeStyles.text}
              />
              <Text
                style={[
                  styles.locationChipText,
                  { color: themeStyles.text },
                ]}
              >
                {location ? "Sorting by distance" : "Use my location"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Location status messages */}
      {status === "denied" && (
        <Text style={[styles.statusText, { color: "#ff6247" }]}>
          Turn on location permissions in settings to sort by nearest.
        </Text>
      )}
      {error && status === "error" && (
        <Text style={[styles.statusText, { color: "#ff6247" }]}>
          {error}
        </Text>
      )}

      {/* Feed filter */}
      <View style={styles.filterRow}>
        <View
          style={[
            styles.filterPillContainer,
            { backgroundColor: themeStyles.card },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.filterPill,
              feedFilter === "all" && styles.filterPillActive,
            ]}
            onPress={() => setFeedFilter("all")}
          >
            <Text
              style={[
                styles.filterPillText,
                {
                  color:
                    feedFilter === "all"
                      ? "#fff"
                      : themeStyles.text,
                },
              ]}
            >
              For you
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              feedFilter === "mine" && styles.filterPillActive,
            ]}
            onPress={() => setFeedFilter("mine")}
          >
            <Text
              style={[
                styles.filterPillText,
                {
                  color:
                    feedFilter === "mine"
                      ? "#fff"
                      : themeStyles.text,
                },
              ]}
            >
              My posts
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredFeed}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ color: themeStyles.muted }}>
              No posts yet. Add your first dish!
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  locationChip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  locationChipText: {
    fontSize: 11,
    marginLeft: 4,
  },
  statusText: {
    fontSize: 11,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  filterRow: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 4,
  },
  filterPillContainer: {
    flexDirection: "row",
    borderRadius: 999,
    padding: 2,
  },
  filterPill: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 999,
    alignItems: "center",
  },
  filterPillActive: {
    backgroundColor: "#ff6247",
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 100,
  },
  emptyContainer: {
    marginTop: 32,
    alignItems: "center",
  },
});

export default HomeScreen;
