import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const categories = ["Filipino", "Korean", "Drinks", "Dessert"];

export default function AddDishScreen({ navigation }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", "Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddDish = () => {
    if (!name.trim() || !description.trim() || !image) {
      Alert.alert("Missing Info", "Please fill all fields and pick an image.");
      return;
    }

    // Normally, send to backend or context here
    Alert.alert("Success!", `Dish "${name}" added successfully!`);

    // Reset form
    setName("");
    setDescription("");
    setCategory(categories[0]);
    setImage(null);
    navigation.goBack();
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>Add New Dish</Text>

      <Text style={styles.label}>Dish Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter dish name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Enter description"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.categoryContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              category === cat && styles.categorySelected,
            ]}
            onPress={() => setCategory(cat)}
          >
            <Text
              style={[
                styles.categoryText,
                category === cat && { color: "#fff" },
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Dish Image</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} resizeMode="cover" />
        ) : (
          <Text style={styles.imageText}>Tap to select image</Text>
        )}
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <Button title="Add Dish" color="#ff6247" onPress={handleAddDish} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Cancel" color="#888" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 8,
  },
  categoryButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ff6247",
    marginRight: 10,
    marginBottom: 10,
  },
  categorySelected: {
    backgroundColor: "#ff6247",
  },
  categoryText: {
    color: "#ff6247",
    fontSize: 14,
  },
  imagePicker: {
    height: 180,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#f0f0f0",
  },
  imageText: { color: "#888" },
  imagePreview: { width: "100%", height: "100%", borderRadius: 15 },
  buttonContainer: { marginVertical: 8 },
});
