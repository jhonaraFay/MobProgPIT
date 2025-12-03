// screens/ProfileScreen.js
import React, { useContext, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Modal,
  TextInput,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { DishContext } from "../context/DishContext";

const ProfileScreen = () => {
  const navigation = useNavigation();

  const { user, updateProfile } = useContext(AuthContext);
  const { styles: themeStyles, theme } = useContext(ThemeContext);
  const { dishes = [] } = useContext(DishContext);

  const [activeTab, setActiveTab] = useState("posts");
  const [editVisible, setEditVisible] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState(
    user?.displayName || user?.username || ""
  );
  const [editBio, setEditBio] = useState(
    user?.bio ||
      "Sharing my favorite Filipino & Japanese dishes 🍣🍜"
  );

  const isDark = theme === "dark";

  const displayName =
    user?.displayName || user?.username || "Food Lover";
  const handleText =
    "@" + (user?.username || "foodlover").toLowerCase();
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const avatarUri = user?.avatarUri || null;

  const myPosts = useMemo(() => {
    if (!dishes) return [];
    if (!user?.username) return dishes;

    return dishes.filter(
      (d) =>
        !d.ownerUsername || d.ownerUsername === user.username
    );
  }, [dishes, user]);

  const likedPosts = useMemo(
    () => (dishes || []).filter((d) => d.liked),
    [dishes]
  );

  const postsCount = myPosts.length;
  const likesCount = myPosts.reduce(
    (sum, d) => sum + (typeof d.likes === "number" ? d.likes : 0),
    0
  );
  const followingCount = 42; // demo

  const dataToRender =
    activeTab === "posts" ? myPosts : likedPosts;

  const handleOpenEdit = () => {
    setEditDisplayName(displayName);
    setEditBio(
      user?.bio ||
        "Sharing my favorite Filipino & Japanese dishes 🍣🍜"
    );
    setEditVisible(true);
  };

  const handleSaveEdit = () => {
    updateProfile({
      displayName: editDisplayName.trim() || user?.username,
      bio: editBio.trim(),
    });
    setEditVisible(false);
  };

  const handleShareProfile = async () => {
    try {
      const username = user?.username || "foodlover";
      const link = `https://dishcovery.app/u/${username}`;
      await Share.share({
        title: "Check out my Dishcovery profile",
        message: `Check out my food finds on Dishcovery: ${link}`,
      });
    } catch (e) {
      console.warn("Error sharing profile", e);
    }
  };

  const handleChangeAvatar = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access gallery is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      updateProfile({ avatarUri: uri });
    }
  };

  const renderGridItem = ({ item }) => {
    const imageSource =
      typeof item.image === "string"
        ? { uri: item.image }
        : item.image;

    return (
      <TouchableOpacity
        style={styles.gridItem}
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate("DishDetail", { dishId: item.id })
        }
      >
        {imageSource && (
          <Image source={imageSource} style={styles.gridImage} />
        )}
        <View style={styles.gridOverlay}>
          <Ionicons name="heart" size={12} color="#fff" />
          <Text style={styles.gridOverlayText}>
            {item.likes ?? 0}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: themeStyles.background },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.leftHeader}>
          <Text style={[styles.username, { color: themeStyles.text }]}>
            {displayName}
          </Text>
          <Text style={[styles.handle, { color: themeStyles.muted }]}>
            {handleText}
          </Text>
        </View>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons
            name="qr-code-outline"
            size={22}
            color={themeStyles.text}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons
            name="ellipsis-vertical"
            size={20}
            color={themeStyles.text}
          />
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={styles.profileRow}>
        <TouchableOpacity onPress={handleChangeAvatar}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarLetter}>
              <Text style={styles.avatarLetterText}>
                {avatarInitial}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <View className="stats" style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: themeStyles.text }]}>
              {postsCount}
            </Text>
            <Text style={[styles.statLabel, { color: themeStyles.muted }]}>
              Posts
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: themeStyles.text }]}>
              {likesCount}
            </Text>
            <Text style={[styles.statLabel, { color: themeStyles.muted }]}>
              Likes
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: themeStyles.text }]}>
              {followingCount}
            </Text>
            <Text style={[styles.statLabel, { color: themeStyles.muted }]}>
              Following
            </Text>
          </View>
        </View>
      </View>

      {/* Bio */}
      <View style={styles.bioContainer}>
        <Text style={[styles.bioName, { color: themeStyles.text }]}>
          {displayName}
        </Text>
        <Text style={[styles.bioText, { color: themeStyles.muted }]}>
          {user?.bio ||
            "Sharing my favorite Filipino & Japanese dishes 🍣🍜"}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: isDark ? "#333" : "#eee" },
          ]}
          onPress={handleOpenEdit}
        >
          <Text style={[styles.actionText, { color: themeStyles.text }]}>
            Edit profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: isDark ? "#333" : "#eee" },
          ]}
          onPress={handleShareProfile}
        >
          <Text style={[styles.actionText, { color: themeStyles.text }]}>
            Share profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionIconButton,
            { backgroundColor: isDark ? "#333" : "#eee" },
          ]}
        >
          <Ionicons
            name="bookmark-outline"
            size={18}
            color={themeStyles.text}
          />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "posts" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("posts")}
        >
          <Ionicons
            name="grid-outline"
            size={20}
            color={
              activeTab === "posts" ? "#ff6247" : themeStyles.muted
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "liked" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("liked")}
        >
          <Ionicons
            name="heart-outline"
            size={20}
            color={
              activeTab === "liked" ? "#ff6247" : themeStyles.muted
            }
          />
        </TouchableOpacity>
      </View>

      {/* Grid of dishes */}
      <FlatList
        data={dataToRender}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={styles.gridRow}
        renderItem={renderGridItem}
        contentContainerStyle={{
          paddingHorizontal: 4,
          paddingBottom: 80,
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ color: themeStyles.muted }}>
              {activeTab === "posts"
                ? "You haven't posted any dishes yet."
                : "No liked dishes yet."}
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
      {/* Edit Profile Modal (same as before, plus profile fields) */}
      <Modal
        visible={editVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: themeStyles.card },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: themeStyles.text },
              ]}
            >
              Edit profile
            </Text>

            <Text
              style={[
                styles.modalLabel,
                { color: themeStyles.muted },
              ]}
            >
              Display name
            </Text>
            <TextInput
              value={editDisplayName}
              onChangeText={setEditDisplayName}
              style={[
                styles.modalInput,
                {
                  backgroundColor: themeStyles.background,
                  color: themeStyles.text,
                },
              ]}
              placeholder="Your name"
              placeholderTextColor={themeStyles.muted}
            />

            <Text
              style={[
                styles.modalLabel,
                { color: themeStyles.muted, marginTop: 8 },
              ]}
            >
              Bio
            </Text>
            <TextInput
              value={editBio}
              onChangeText={setEditBio}
              style={[
                styles.modalInput,
                styles.modalInputMultiline,
                {
                  backgroundColor: themeStyles.background,
                  color: themeStyles.text,
                },
              ]}
              placeholder="Tell people about your favorite eats..."
              placeholderTextColor={themeStyles.muted}
              multiline
            />

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonGhost]}
                onPress={() => setEditVisible(false)}
              >
                <Text
                  style={[
                    styles.modalButtonGhostText,
                    { color: themeStyles.muted },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.modalButtonPrimaryText}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;


const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  leftHeader: { flex: 1 },
  username: { fontSize: 18, fontWeight: "bold" },
  handle: { fontSize: 12, marginTop: 2 },
  headerIcon: { paddingHorizontal: 6 },
  profileRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 16,
    alignItems: "center",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 40,
    backgroundColor: "#333",
    marginRight: 24,
  },
  avatarLetter: {
    width: 72,
    height: 72,
    borderRadius: 40,
    backgroundColor: "#ff6247",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 24,
  },
  avatarLetterText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
  },
  statBox: { alignItems: "center", flex: 1 },
  statNumber: { fontSize: 16, fontWeight: "bold" },
  statLabel: { fontSize: 12, marginTop: 4 },
  bioContainer: { paddingHorizontal: 16, marginTop: 10 },
  bioName: { fontWeight: "600", marginBottom: 4 },
  bioText: { fontSize: 13 },
  actionsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    height: 34,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  actionIconButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  actionText: { fontSize: 13, fontWeight: "500" },
  tabsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#333",
  },
  tabButton: { paddingVertical: 10, paddingHorizontal: 28 },
  activeTabButton: { borderBottomWidth: 2, borderBottomColor: "#ff6247" },
  gridRow: { justifyContent: "space-between", marginBottom: 4 },
  gridItem: {
    marginHorizontal: 2,
    marginBottom: 4,
    position: "relative",
  },
  gridImage: { width: 118, height: 118, borderRadius: 8 },
  gridOverlay: {
    position: "absolute",
    bottom: 6,
    left: 6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  gridOverlayText: { color: "#fff", fontSize: 11, marginLeft: 3 },
  emptyContainer: { paddingTop: 32, alignItems: "center" },
  // modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  modalLabel: { fontSize: 12, marginBottom: 4 },
  modalInput: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  modalInputMultiline: {
    minHeight: 70,
    textAlignVertical: "top",
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  modalButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    marginLeft: 8,
  },
  modalButtonGhost: { backgroundColor: "transparent" },
  modalButtonGhostText: { fontSize: 13 },
  modalButtonPrimary: { backgroundColor: "#ff6247" },
  modalButtonPrimaryText: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "600",
  },
});
