// ProfileScreen.js
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../context/ThemeContext";

const ProfileScreen = () => {
  const { styles: theme } = useContext(ThemeContext) || {};

  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Posts");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [avatarScale] = useState(new Animated.Value(1));

  const userPosts = [
    { id: 1, image: require("../assets/dish1.jpg"), title: "Spicy Ramen", likes: 120, comments: ["Looks tasty!", "Yum!"] },
    { id: 2, image: require("../assets/dish2.jpg"), title: "Chocolate Cake", likes: 89, comments: ["Sweet!", "Delicious!"] },
    { id: 3, image: require("../assets/dish3.jpg"), title: "Sushi Platter", likes: 200, comments: ["I want some!", "So fresh!"] },
    { id: 4, image: require("../assets/dish4.jpg"), title: "Adobo", likes: 76, comments: ["Classic!", "Love it!"] },
    { id: 5, image: require("../assets/dish5.jpg"), title: "Halo-halo", likes: 150, comments: ["Refreshing!", "Perfect for summer!"] },
  ];

  const likedPosts = [
    { id: 6, image: require("../assets/dish6.jpg"), title: "Pancit Canton", likes: 98, comments: ["Nostalgic!", "Tasty!"] },
    { id: 7, image: require("../assets/dish7.jpg"), title: "Lechon", likes: 210, comments: ["So crispy!", "Yummy!"] },
  ];

  const commentedPosts = [
    { id: 8, image: require("../assets/dish8.jpg"), title: "Burger", likes: 45, comments: ["Looks good!"] },
  ];

  useEffect(() => {
    loadAvatar();
  }, []);

  const loadAvatar = async () => {
    try {
      const saved = await AsyncStorage.getItem("avatar");
      if (saved) setAvatar(saved);
    } catch (err) {
      console.log("Error loading avatar:", err);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission required to access gallery");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });

      if (!result.canceled) {
        setLoading(true);
        const uri = result.assets[0].uri;
        setAvatar(uri);
        await AsyncStorage.setItem("avatar", uri);
        setLoading(false);
      }
    } catch (err) {
      console.log("Error picking image:", err);
      setLoading(false);
    }
  };

  const handleAvatarPress = () => {
    Animated.sequence([
      Animated.timing(avatarScale, { toValue: 0.85, duration: 100, useNativeDriver: true }),
      Animated.timing(avatarScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => pickImage());
  };

  const postsToDisplay = activeTab === "Posts" ? userPosts : activeTab === "Liked" ? likedPosts : commentedPosts;

  const openModal = (post) => {
    setSelectedPost(post);
    setModalVisible(true);
  };

  const renderGridItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)} style={{ position: "relative", marginBottom: 4 }}>
      <Image source={item.image} style={styles.gridImage} />
      <View style={styles.overlay}>
        <View style={styles.overlayItem}>
          <Ionicons name="heart" size={14} color="#fff" />
          <Text style={styles.overlayText}>{item.likes}</Text>
        </View>
        <View style={styles.overlayItem}>
          <Ionicons name="chatbubble" size={14} color="#fff" />
          <Text style={styles.overlayText}>{item.comments?.length || 0}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <View>
      <Animated.View style={[styles.avatarWrapper, { transform: [{ scale: avatarScale }] }]}>
        {loading ? (
          <ActivityIndicator size="large" color="#555" />
        ) : (
          <Image
            source={avatar ? { uri: avatar } : require("../assets/default-avatar.jpeg")}
            style={styles.avatar}
          />
        )}
        <TouchableOpacity style={styles.editButton} onPress={handleAvatarPress}>
          <Ionicons name="camera" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      <Text style={[styles.username, { color: theme?.text || "#000" }]}>Foodie123</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>50</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>1.2k</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>180</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        {["Posts", "Liked", "Comments"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme?.background || "#f9f9f9" }]}>
      <FlatList
        data={postsToDisplay}
        renderItem={renderGridItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 4 }}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Modal for post detail */}
      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
          <TouchableOpacity style={{ padding: 16 }} onPress={() => setModalVisible(false)}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          {selectedPost && (
            <ScrollView>
              <Image source={selectedPost.image} style={{ width: "100%", height: 300 }} resizeMode="contain" />
              <View style={{ padding: 16 }}>
                <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>{selectedPost.title}</Text>
                <Text style={{ color: "#fff", marginTop: 8 }}>{selectedPost.likes} Likes</Text>

                <Text style={{ color: "#fff", marginTop: 12, fontWeight: "bold" }}>Comments:</Text>
                {selectedPost.comments?.length > 0 ? (
                  selectedPost.comments.map((c, i) => (
                    <Text key={i} style={{ color: "#fff", marginTop: 4 }}>
                      - {c}
                    </Text>
                  ))
                ) : (
                  <Text style={{ color: "#fff", marginTop: 4 }}>No comments yet.</Text>
                )}
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  avatarWrapper: { position: "relative", alignItems: "center", marginBottom: 12 },
  avatar: { width: 130, height: 130, borderRadius: 65, borderWidth: 2, borderColor: "#ccc" },
  editButton: { position: "absolute", bottom: 0, right: 0, backgroundColor: "#ff6247", padding: 10, borderRadius: 25, borderWidth: 2, borderColor: "#fff" },
  username: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 12 },
  statsContainer: { flexDirection: "row", justifyContent: "space-around", marginVertical: 12 },
  statBox: { alignItems: "center" },
  statNumber: { fontWeight: "bold", fontSize: 16 },
  statLabel: { fontSize: 12, color: "#888" },
  tabContainer: { flexDirection: "row", justifyContent: "center", marginVertical: 12 },
  tabButton: { paddingHorizontal: 20, paddingVertical: 8, marginHorizontal: 4, borderBottomWidth: 2, borderBottomColor: "transparent" },
  activeTab: { borderBottomColor: "#ff6247" },
  tabText: { fontSize: 16, color: "#888" },
  activeTabText: { color: "#ff6247", fontWeight: "bold" },
  gridImage: { width: 110, height: 110, borderRadius: 8 },
  overlay: { position: "absolute", bottom: 4, left: 4, flexDirection: "row" },
  overlayItem: { flexDirection: "row", alignItems: "center", marginRight: 8, backgroundColor: "rgba(0,0,0,0.5)", paddingHorizontal: 4, paddingVertical: 2, borderRadius: 6 },
  overlayText: { color: "#fff", fontSize: 12, marginLeft: 2 },
});
