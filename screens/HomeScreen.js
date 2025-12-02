import React, { useContext, useState, useMemo, useLayoutEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  Button,
  Image,
  ActivityIndicator,
} from "react-native";
import DishCard from "../components/DishCard";
import { DishContext } from "../context/DishContext";
import { ThemeContext } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const CATEGORIES = ["All", "Filipino", "Japanese", "Italian", "Korean", "Drinks", "Dessert"];

const HomeScreen = ({ navigation }) => {
  const { dishes = [], addDish, editDish } = useContext(DishContext) || {};
  const { styles: theme = {} } = useContext(ThemeContext) || {};

  const [modalVisible, setModalVisible] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [dishName, setDishName] = useState("");
  const [dishDescription, setDishDescription] = useState("");
  const [dishCategory, setDishCategory] = useState("Filipino");
  const [dishImage, setDishImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const openAddModal = () => {
    setEditingDish(null);
    setDishName("");
    setDishDescription("");
    setDishCategory("Filipino");
    setDishImage(null);
    setModalVisible(true);
  };

  const openEditModal = (dish) => {
    setEditingDish(dish);
    setDishName(dish.name || "");
    setDishDescription(dish.description || "");
    setDishCategory(dish.category || "Filipino");
    setDishImage(dish.image || null);
    setModalVisible(true);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow gallery access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled) {
      setLoadingImage(true);
      const uri = result.assets[0].uri;
      setDishImage(uri);
      setLoadingImage(false);
    }
  };

  const handleSubmit = () => {
    if (!dishName.trim() || !dishDescription.trim() || !dishImage) {
      Alert.alert("Missing Info", "Please fill all fields and pick an image.");
      return;
    }

    const newDish = {
      name: dishName,
      description: dishDescription,
      category: dishCategory,
      image: dishImage,
    };

    if (editingDish?.id) {
      editDish?.(editingDish.id, newDish);
    } else {
      addDish?.(newDish);
    }

    setModalVisible(false);
  };

  const filtered = useMemo(() => {
    let list = dishes || [];
    if (activeCategory !== "All") list = list.filter((d) => d.category === activeCategory);
    if (query.trim() !== "") {
      const q = query.toLowerCase();
      list = list.filter(
        (d) =>
          (d.name && d.name.toLowerCase().includes(q)) ||
          (d.description && d.description.toLowerCase().includes(q))
      );
    }
    return list;
  }, [dishes, query, activeCategory]);

  const renderItem = ({ item }) => <DishCard dish={item} onEdit={openEditModal} />;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={{ marginRight: 15 }}>
            <Ionicons name="person-circle-outline" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
            <Ionicons name="settings-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background || "#fff" }]}>
      {/* Search and Add */}
      <View style={styles.headerRow}>
        <TextInput
          placeholder="Search dishes..."
          placeholderTextColor={theme.muted || "#888"}
          style={[styles.searchInput, { backgroundColor: theme.card || "#eee", color: theme.text || "#000" }]}
          value={query}
          onChangeText={setQuery}
        />
        <Button title="Add" onPress={openAddModal} color="#ff6247" />
      </View>

      {/* Category Filter */}
      <View style={styles.filterRow}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setActiveCategory(cat)}
            style={[styles.catButton, { backgroundColor: activeCategory === cat ? theme.card || "#ccc" : "transparent", borderColor: theme.card || "#ccc" }]}
          >
            <Text style={{ color: theme.text || "#000" }}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Dish List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: theme.muted || "#888", marginTop: 20 }}>
            No dishes found.
          </Text>
        }
      />

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={[styles.modalContainer, { backgroundColor: theme.background || "#fff" }]}>
          <Text style={[styles.modalTitle, { color: theme.text || "#000" }]}>{editingDish?.id ? "Edit Dish" : "Add New Dish"}</Text>

          <TextInput
            placeholder="Dish Name"
            placeholderTextColor={theme.muted || "#888"}
            style={[styles.input, { backgroundColor: theme.card || "#eee", color: theme.text || "#000" }]}
            value={dishName}
            onChangeText={setDishName}
          />

          <TextInput
            placeholder="Description"
            placeholderTextColor={theme.muted || "#888"}
            style={[styles.input, { backgroundColor: theme.card || "#eee", color: theme.text || "#000", height: 80 }]}
            value={dishDescription}
            onChangeText={setDishDescription}
            multiline
          />

          {/* Image Picker */}
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {loadingImage ? (
              <ActivityIndicator size="large" color="#555" />
            ) : dishImage ? (
              <Image source={{ uri: dishImage }} style={styles.imagePreview} />
            ) : (
              <Text style={{ color: "#888" }}>Tap to select image</Text>
            )}
          </TouchableOpacity>

          <Button title={editingDish?.id ? "Save Changes" : "Post Dish"} onPress={handleSubmit} color="#ff6247" />
          <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { flexDirection: "row", padding: 10, alignItems: "center", gap: 8 },
  searchInput: { flex: 1, padding: 10, borderRadius: 8 },
  filterRow: { flexDirection: "row", paddingHorizontal: 10, paddingBottom: 6, flexWrap: "wrap" },
  catButton: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1, marginRight: 8, marginBottom: 8 },
  modalContainer: { flex: 1, padding: 16, justifyContent: "center" },
  modalTitle: { fontSize: 22, textAlign: "center", marginBottom: 12 },
  input: { borderRadius: 8, padding: 10, marginBottom: 12 },
  imagePicker: { height: 180, borderRadius: 12, borderWidth: 1, borderColor: "#ddd", justifyContent: "center", alignItems: "center", marginBottom: 12, backgroundColor: "#f0f0f0" },
  imagePreview: { width: "100%", height: "100%", borderRadius: 12 },
});
