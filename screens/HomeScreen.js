// HomeScreen.js
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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import DishCard from "../components/DishCard";
import { DishContext } from "../context/DishContext";
import { ThemeContext } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const CATEGORIES = ["All", "Filipino", "Korean", "Drinks", "Dessert"];

// Demo user location
const demoUserLocation = { lat: 8.4542, lng: 124.6319 };

// Haversine distance
const getDistance = (loc1, loc2) => {
  const R = 6371;
  const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
  const dLon = ((loc2.lng - loc1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((loc1.lat * Math.PI) / 180) *
      Math.cos((loc2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const HomeScreen = ({ navigation }) => {
  const { dishes = [], addDish, editDish } = useContext(DishContext) || {};
  const { styles: theme = {} } = useContext(ThemeContext) || {};

  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [selectedDish, setSelectedDish] = useState(null);

  const [dishName, setDishName] = useState("");
  const [dishDescription, setDishDescription] = useState("");
  const [dishCategory, setDishCategory] = useState("Filipino");
  const [dishImage, setDishImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [newComment, setNewComment] = useState("");

  // Open modal for adding new dish
  const openAddModal = () => {
    setEditingDish(null);
    setDishName("");
    setDishDescription("");
    setDishCategory("Filipino");
    setDishImage(null);
    setModalVisible(true);
  };

  // Open modal for editing dish
  const openEditModal = (dish) => {
    setEditingDish(dish);
    setDishName(dish.name || "");
    setDishDescription(dish.description || "");
    setDishCategory(dish.category || "Filipino");
    setDishImage(dish.image || null);
    setModalVisible(true);
  };

  // Open view modal
  const openViewModal = (dish) => {
    setSelectedDish({
      ...dish,
      comments: dish.comments || [],
      likes: dish.likes || 0,
      liked: dish.liked || false,
      distance: dish.location ? getDistance(demoUserLocation, dish.location) : null,
    });
    setViewModalVisible(true);
  };

  const closeViewModal = () => {
    setViewModalVisible(false);
    setSelectedDish(null);
    setNewComment("");
  };

  // Pick Image
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

  // Submit add/edit form
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
      location: { lat: 8.455 + Math.random() * 0.02, lng: 124.63 + Math.random() * 0.02 }, // Demo location
      likes: 0,
      comments: [],
      liked: false,
    };

    if (editingDish?.id) {
      editDish?.(editingDish.id, newDish);
    } else {
      addDish?.(newDish);
    }

    setModalVisible(false);
  };

  const addComment = () => {
    if (!newComment.trim()) return;
    setSelectedDish((prev) => ({
      ...prev,
      comments: [...prev.comments, newComment.trim()],
    }));
    setNewComment("");
  };

  const toggleLike = () => {
    setSelectedDish((prev) => ({
      ...prev,
      liked: !prev.liked,
      likes: prev.liked ? prev.likes - 1 : prev.likes + 1,
    }));
  };

  // Filtered dishes
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
    // Add distance for demo
    list = list.map((d) => ({
      ...d,
      distance: d.location ? getDistance(demoUserLocation, d.location) : null,
    }));
    // Sort by distance
    return list.sort((a, b) => (a.distance || 999) - (b.distance || 999));
  }, [dishes, query, activeCategory]);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openViewModal(item)}>
      <DishCard dish={item} onEdit={openEditModal} />
      {item.distance && (
        <Text style={{ color: theme.muted || "#888", fontSize: 12, marginLeft: 12 }}>
          {item.distance.toFixed(1)} km away
        </Text>
      )}
    </TouchableOpacity>
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
            style={{ marginRight: 15 }}
          >
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
          style={[
            styles.searchInput,
            { backgroundColor: theme.card || "#eee", color: theme.text || "#000" },
          ]}
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
            style={[
              styles.catButton,
              {
                backgroundColor: activeCategory === cat ? theme.card || "#ccc" : "transparent",
                borderColor: theme.card || "#ccc",
              },
            ]}
          >
            <Text style={{ color: theme.text || "#000" }}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Dish List */}
      <FlatList
        data={filtered}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <Text
            style={{ textAlign: "center", color: theme.muted || "#888", marginTop: 20 }}
          >
            No dishes found.
          </Text>
        }
      />

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.modalContainer, { backgroundColor: theme.background || "#fff" }]}>
            <Text style={[styles.modalTitle, { color: theme.text || "#000" }]}>
              {editingDish?.id ? "Edit Dish" : "Add New Dish"}
            </Text>

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
              style={[
                styles.input,
                { backgroundColor: theme.card || "#eee", color: theme.text || "#000", height: 80 },
              ]}
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
        </TouchableWithoutFeedback>
      </Modal>

      {/* View Dish Modal */}
      <Modal visible={viewModalVisible} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={[styles.viewModalContainer, { backgroundColor: "rgba(0,0,0,0.7)" }]}
          >
            {selectedDish && (
              <View style={[styles.modalContent, { backgroundColor: theme.background || "#fff" }]}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={closeViewModal}>
                    <Ionicons name="arrow-back-outline" size={28} color={theme.text || "#000"} />
                  </TouchableOpacity>
                  <Text style={[styles.modalTitle, { color: theme.text || "#000" }]}>{selectedDish.name}</Text>
                  <View style={{ width: 28 }} />
                </View>

                <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                  <Text style={[styles.modalDesc, { color: theme.text || "#000", marginBottom: 6 }]}>
                    {selectedDish.description}
                  </Text>
                  {selectedDish.distance && (
                    <Text style={{ color: theme.muted || "#555", fontSize: 12, marginBottom: 6 }}>
                      {selectedDish.distance.toFixed(1)} km away
                    </Text>
                  )}
                  <Image source={{ uri: selectedDish.image }} style={styles.modalImage} />

                  {/* Likes */}
                  <TouchableOpacity style={styles.likeRow} onPress={toggleLike}>
                    <Ionicons
                      name={selectedDish.liked ? "heart" : "heart-outline"}
                      size={28}
                      color={selectedDish.liked ? "red" : theme.text || "#000"}
                    />
                    <Text style={[styles.likeText, { color: theme.text || "#000" }]}>{selectedDish.likes} Likes</Text>
                  </TouchableOpacity>

                  <Text style={[styles.commentsTitle, { color: theme.text || "#000" }]}>Comments</Text>
                  {selectedDish.comments.length > 0 ? (
                    selectedDish.comments.map((c, i) => (
                      <Text key={i} style={[styles.commentText, { color: theme.text || "#000" }]}>
                        - {c}
                      </Text>
                    ))
                  ) : (
                    <Text style={[styles.commentText, { color: theme.text || "#000" }]}>
                      No comments yet.
                    </Text>
                  )}
                </ScrollView>

                {/* Sticky Comment Input */}
                <View style={styles.commentInputRow}>
                  <TextInput
                    placeholder="Add a comment..."
                    placeholderTextColor={theme.muted || "#888"}
                    style={[styles.commentInput, { backgroundColor: theme.card || "#eee", color: theme.text || "#000" }]}
                    value={newComment}
                    onChangeText={setNewComment}
                  />
                  <TouchableOpacity onPress={addComment} style={styles.sendButton}>
                    <Ionicons name="send" size={22} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
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

  // Add/Edit Modal
  modalContainer: { flex: 1, padding: 16, justifyContent: "center" },
  modalTitle: { fontSize: 22, textAlign: "center", marginBottom: 12 },
  input: { borderRadius: 8, padding: 10, marginBottom: 12 },
  imagePicker: {
    height: 180,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#f0f0f0",
  },
  imagePreview: { width: "100%", height: "100%", borderRadius: 12 },

  // View Modal
  viewModalContainer: { flex: 1, justifyContent: "flex-end" },
  modalContent: { flex: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16 },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  modalDesc: { fontSize: 16, marginBottom: 12 },
  modalImage: { width: "100%", height: 250, borderRadius: 12, marginBottom: 12 },
  likeRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  likeText: { fontSize: 16, marginLeft: 8 },
  commentsTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 6 },
  commentText: { fontSize: 14, marginBottom: 4 },
  commentInputRow: { flexDirection: "row", alignItems: "center", borderTopWidth: 1, borderTopColor: "#333", paddingVertical: 8, paddingHorizontal: 4 },
  commentInput: { flex: 1, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  sendButton: { marginLeft: 8, padding: 10, backgroundColor: "#ff6247", borderRadius: 20 },
});
