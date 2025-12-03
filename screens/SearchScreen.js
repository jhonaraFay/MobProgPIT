// screens/SearchScreen.js
import React, { useContext, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { DishContext } from "../context/DishContext";
import { ThemeContext } from "../context/ThemeContext";
import DishCard from "../components/DishCard";

const SearchScreen = () => {
  const navigation = useNavigation();
  const { dishes } = useContext(DishContext);
  const { styles: themeStyles } = useContext(ThemeContext);

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return dishes;

    return dishes.filter((d) => {
      const name = d.name?.toLowerCase() || "";
      const place = d.placeName?.toLowerCase() || "";
      const addr = d.address?.toLowerCase() || "";
      const cat = d.category?.toLowerCase() || "";
      return (
        name.includes(q) ||
        place.includes(q) ||
        addr.includes(q) ||
        cat.includes(q)
      );
    });
  }, [dishes, query]);

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
      <View style={styles.searchRow}>
        <View
          style={[
            styles.searchBox,
            { backgroundColor: themeStyles.card },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={18}
            color={themeStyles.muted}
            style={{ marginRight: 6 }}
          />
          <TextInput
            style={[styles.searchInput, { color: themeStyles.text }]}
            placeholder="Search dishes, places, categories..."
            placeholderTextColor={themeStyles.muted}
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingBottom: 80,
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ color: themeStyles.muted }}>
              No results. Try a different keyword.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchRow: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  emptyContainer: {
    marginTop: 32,
    alignItems: "center",
  },
});
