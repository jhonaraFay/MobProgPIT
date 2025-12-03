// screens/AddDishScreen.js
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";


import { ThemeContext } from "../context/ThemeContext";
import { DishContext } from "../context/DishContext";
import { LocationContext } from "../context/LocationContext";
import { AuthContext } from "../context/AuthContext";


const AddDishScreen = () => {
  const navigation = useNavigation();


  const { styles: themeStyles } = useContext(ThemeContext);
  const { addDish } = useContext(DishContext);
  const { requestLocation, status } = useContext(LocationContext);
  const { user } = useContext(AuthContext);


  const [imageUri, setImageUri] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState(null);
  const [submitting, setSubmitting] = useState(false);


  const pickImage = async (fromCamera = false) => {
    try {
      if (fromCamera) {
        const { status } =
          await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission", "Camera permission is required.");
          return;
        }
      } else {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission", "Gallery permission is required.");
          return;
        }
      }


      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
          });


      if (!result.canceled && result.assets?.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (e) {
      console.warn("Error picking image", e);
      Alert.alert("Error", "Failed to pick image.");
    }
  };


  /**
   * Instead of auto-attaching our current location,
   * this now:
   *  1) optionally asks for current location (just to center the map)
   *  2) navigates to LocationPickerScreen
   *  3) when user taps "Save location" there, it calls our onPick callback
   *     and we setCoords() here.
   */
  const handleChooseLocation = async () => {
    try {
      let initialCenter = coords;


      // If we don't already have coords, try to get current location just to center the map
      if (!initialCenter) {
        const result = await requestLocation();
        if (result) {
          initialCenter = result;
        }
      }


      navigation.navigate("LocationPicker", {
        initialCoords: initialCenter,
        onPick: (picked) => {
          setCoords(picked);
          Alert.alert(
            "Location selected",
            "The map location has been attached to this post."
          );
        },
      });
    } catch (e) {
      console.warn("Error choosing location", e);
    }
  };


  const handleSubmit = () => {
    if (!imageUri) {
      Alert.alert(
        "Missing photo",
        "Please add a photo of the dish."
      );
      return;
    }
    if (!name.trim() || !placeName.trim()) {
      Alert.alert(
        "Missing fields",
        "Dish name and place name are required."
      );
      return;
    }


    setSubmitting(true);
    try {
      addDish({
        name: name.trim(),
        description: description.trim(),
        category: category.trim(),
        placeName: placeName.trim(),
        address: address.trim(),
        latitude: coords?.latitude ?? null,
        longitude: coords?.longitude ?? null,
        image: imageUri,
        ownerUsername: user?.username || "guest",
      });


      Alert.alert("Success", "Your dish has been added!", [
        { text: "OK", onPress: () => navigation.navigate("Home") },
      ]);


      // reset form
      setImageUri(null);
      setName("");
      setDescription("");
      setCategory("");
      setPlaceName("");
      setAddress("");
      setCoords(null);
    } catch (e) {
      console.warn("Error adding dish", e);
      Alert.alert("Error", "Failed to add dish.");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: themeStyles.background },
      ]}
    >
      {/* Header with back button */}
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
          Add a dish
        </Text>
        <View style={{ width: 32 }} />
      </View>


      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 220,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            styles.subtitle,
            { color: themeStyles.muted, marginBottom: 16 },
          ]}
        >
          Share an eatery so others can discover it.
        </Text>


        {/* Photo */}
        <Text style={[styles.label, { color: themeStyles.text }]}>
          Photo <Text style={{ color: "#ff6247" }}>*</Text>
        </Text>
        <View
          style={[
            styles.photoBox,
            { backgroundColor: themeStyles.card },
          ]}
        >
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.photoImage}
            />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Ionicons
                name="image-outline"
                size={36}
                color={themeStyles.muted}
              />
              <Text
                style={{
                  color: themeStyles.muted,
                  marginTop: 6,
                  fontSize: 13,
                }}
              >
                No image selected
              </Text>
            </View>
          )}
        </View>


        <View style={styles.photoButtonsRow}>
          <TouchableOpacity
            style={styles.photoButton}
            onPress={() => pickImage(false)}
          >
            <Ionicons
              name="images-outline"
              size={18}
              color="#fff"
            />
            <Text style={styles.photoButtonText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.photoButton}
            onPress={() => pickImage(true)}
          >
            <Ionicons
              name="camera-outline"
              size={18}
              color="#fff"
            />
            <Text style={styles.photoButtonText}>Camera</Text>
          </TouchableOpacity>
        </View>


        {/* Dish name */}
        <Text
          style={[
            styles.label,
            { color: themeStyles.text, marginTop: 16 },
          ]}
        >
          Dish name <Text style={{ color: "#ff6247" }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: themeStyles.card,
              color: themeStyles.text,
            },
          ]}
          placeholder="e.g. Tonkotsu Ramen"
          placeholderTextColor={themeStyles.muted}
          value={name}
          onChangeText={setName}
        />


        {/* Description */}
        <Text
          style={[
            styles.label,
            { color: themeStyles.text, marginTop: 10 },
          ]}
        >
          Description
        </Text>
        <TextInput
          style={[
            styles.input,
            styles.inputMultiline,
            {
              backgroundColor: themeStyles.card,
              color: themeStyles.text,
            },
          ]}
          placeholder="What makes this dish special?"
          placeholderTextColor={themeStyles.muted}
          value={description}
          multiline
          onChangeText={setDescription}
        />


        {/* Category */}
        <Text
          style={[
            styles.label,
            { color: themeStyles.text, marginTop: 10 },
          ]}
        >
          Category
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: themeStyles.card,
              color: themeStyles.text,
            },
          ]}
          placeholder="e.g. Filipino, Japanese, Dessert"
          placeholderTextColor={themeStyles.muted}
          value={category}
          onChangeText={setCategory}
        />


        {/* Place name */}
        <Text
          style={[
            styles.label,
            { color: themeStyles.text, marginTop: 10 },
          ]}
        >
          Place name{" "}
          <Text style={{ color: "#ff6247" }}>* </Text>
          <Text
            style={{ color: themeStyles.muted, fontSize: 12 }}
          >
            (restaurant / eatery)
          </Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: themeStyles.card,
              color: themeStyles.text,
            },
          ]}
          placeholder="e.g. Ramen Nagi Greenbelt"
          placeholderTextColor={themeStyles.muted}
          value={placeName}
          onChangeText={setPlaceName}
        />


        {/* Address */}
        <Text
          style={[
            styles.label,
            { color: themeStyles.text, marginTop: 10 },
          ]}
        >
          Address
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: themeStyles.card,
              color: themeStyles.text,
            },
          ]}
          placeholder="e.g. Greenbelt 3, Makati, Metro Manila"
          placeholderTextColor={themeStyles.muted}
          value={address}
          onChangeText={setAddress}
        />


        {/* Location button */}
        <TouchableOpacity
          style={[
            styles.locationButton,
            {
              backgroundColor: "#ff6247",
              borderColor: "#ff6247",
            },
          ]}
          onPress={handleChooseLocation}
          activeOpacity={0.9}
        >
          {status === "requesting" ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="map-outline" size={16} color="#fff" />
              <Text style={styles.locationButtonText}>
                Choose location on map
              </Text>
            </>
          )}
        </TouchableOpacity>


        {coords && (
          <Text
            style={[
              styles.helperText,
              { color: themeStyles.muted },
            ]}
          >
            Selected coordinates: {coords.latitude.toFixed(4)},{" "}
            {coords.longitude.toFixed(4)}
          </Text>
        )}


        {!coords && (
          <Text
            style={[
              styles.helperText,
              { color: themeStyles.muted },
            ]}
          >
            Optional: choose a map location so people can find this
            place.
          </Text>
        )}


        {/* Submit */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            { opacity: submitting ? 0.7 : 1 },
          ]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              Post dish
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};


export default AddDishScreen;


const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 4,
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
  subtitle: {
    fontSize: 13,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  photoBox: {
    borderRadius: 16,
    height: 200,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  photoImage: {
    width: "100%",
    height: "100%",
  },
  photoPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  photoButtonsRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  photoButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#333",
    borderRadius: 999,
    paddingVertical: 10,
    marginRight: 8,
  },
  photoButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  locationButton: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 10,
  },
  locationButtonText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "600",
  },
  helperText: {
    fontSize: 11,
    marginTop: 4,
  },
  submitButton: {
    marginTop: 22,
    backgroundColor: "#ff6247",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});




