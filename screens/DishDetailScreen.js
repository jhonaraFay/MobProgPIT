// screens/DishDetailScreen.js
import React, { useContext, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";

import { DishContext } from "../context/DishContext";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

const DishDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { dishId } = route.params || {};

  const { dishes, toggleLike, addComment } = useContext(DishContext);
  const { styles: themeStyles } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [commentText, setCommentText] = useState("");

  const dish = useMemo(
    () => (dishes || []).find((d) => d.id === dishId),
    [dishes, dishId]
  );

  if (!dish) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: themeStyles.background },
        ]}
      >
        <View style={styles.header}>
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
          <Text style={[styles.headerTitle, { color: themeStyles.text }]}>
            Post not found
          </Text>
        </View>
        <View style={styles.center}>
          <Text style={{ color: themeStyles.muted }}>
            This post no longer exists.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const imageSource =
    typeof dish.image === "string" ? { uri: dish.image } : dish.image;

  const distanceText =
    typeof dish.distanceKm === "number"
      ? dish.distanceKm < 1
        ? `${Math.round(dish.distanceKm * 1000)} m away`
        : `${dish.distanceKm.toFixed(1)} km away`
      : null;

  const comments = Array.isArray(dish.comments) ? dish.comments : [];
  const commentsCount = comments.length;

  const ownerUsername = dish.ownerUsername;
  const ownerLabel = ownerUsername ? "@" + ownerUsername : null;

  const handleLike = () => {
    if (toggleLike && dish.id != null) {
      toggleLike(dish.id);
    }
  };

  const handleOpenMaps = async () => {
    try {
      let url = null;

      if (dish.latitude != null && dish.longitude != null) {
        url = `https://www.google.com/maps/search/?api=1&query=${dish.latitude},${dish.longitude}`;
      } else if (dish.address) {
        const encoded = encodeURIComponent(dish.address);
        url = `https://www.google.com/maps/search/?api=1&query=${encoded}`;
      }

      if (!url) {
        Alert.alert(
          "No location",
          "This post has no location attached yet."
        );
        return;
      }

      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert(
          "Cannot open maps",
          "No app found to open map links on this device."
        );
        return;
      }

      await Linking.openURL(url);
    } catch (e) {
      console.warn("Error opening maps", e);
      Alert.alert(
        "Error",
        "Something went wrong while trying to open Maps."
      );
    }
  };

  const handleAddComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed) return;

    const authorLabel =
      user?.displayName || user?.username || "You";

    // authorIsCurrentUser = true so we always show the latest name
    addComment(dish.id, authorLabel, trimmed, {
      isCurrentUser: true,
    });
    setCommentText("");
  };

  const getDisplayAuthor = (c) => {
    if (c.authorIsCurrentUser) {
      // Always use the *current* profile name
      return user?.displayName || user?.username || c.author || "You";
    }
    return c.author || "User";
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
          numberOfLines={1}
        >
          {dish.placeName || dish.name}
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Image */}
        {imageSource ? (
          <Image source={imageSource} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Ionicons
              name="image-outline"
              size={36}
              color={themeStyles.muted}
            />
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>
          {/* Title + like button */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text
                style={[styles.name, { color: themeStyles.text }]}
              >
                {dish.name}
              </Text>
              {dish.placeName ? (
                <Text
                  style={[
                    styles.placeName,
                    { color: themeStyles.text },
                  ]}
                >
                  {dish.placeName}
                </Text>
              ) : null}
              {ownerLabel && (
                <Text
                  style={[
                    styles.ownerText,
                    { color: themeStyles.muted },
                  ]}
                >
                  Posted by {ownerLabel}
                </Text>
              )}
            </View>

            <TouchableOpacity onPress={handleLike}>
              <View style={styles.likeButton}>
                <Ionicons
                  name={dish.liked ? "heart" : "heart-outline"}
                  size={24}
                  color={dish.liked ? "#ff6247" : themeStyles.text}
                />
                <Text
                  style={[
                    styles.likeCount,
                    { color: themeStyles.text },
                  ]}
                >
                  {typeof dish.likes === "number" ? dish.likes : 0}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Address */}
          {dish.address ? (
            <View style={styles.row}>
              <Ionicons
                name="location-outline"
                size={16}
                color={themeStyles.muted}
              />
              <Text
                style={[
                  styles.address,
                  { color: themeStyles.muted },
                ]}
              >
                {dish.address}
              </Text>
            </View>
          ) : null}

          {/* View in Google Maps */}
          <TouchableOpacity
            style={[
              styles.mapsButton,
              { borderColor: themeStyles.muted },
            ]}
            onPress={handleOpenMaps}
          >
            <Ionicons
              name="map-outline"
              size={18}
              color={themeStyles.text}
            />
            <Text
              style={[
                styles.mapsButtonText,
                { color: themeStyles.text },
              ]}
            >
              View in Google Maps
            </Text>
          </TouchableOpacity>

          {/* Distance + category + time */}
          <View style={styles.metaRow}>
            {distanceText && (
              <View style={styles.metaItem}>
                <Ionicons
                  name="navigate-outline"
                  size={14}
                  color={themeStyles.muted}
                />
                <Text
                  style={[
                    styles.metaText,
                    { color: themeStyles.muted },
                  ]}
                >
                  {distanceText}
                </Text>
              </View>
            )}
            {dish.category && (
              <View style={styles.metaItem}>
                <Ionicons
                  name="restaurant-outline"
                  size={14}
                  color={themeStyles.muted}
                />
                <Text
                  style={[
                    styles.metaText,
                    { color: themeStyles.muted },
                  ]}
                >
                  {dish.category}
                </Text>
              </View>
            )}
            {dish.timeAgo && (
              <View style={styles.metaItem}>
                <Ionicons
                  name="time-outline"
                  size={14}
                  color={themeStyles.muted}
                />
                <Text
                  style={[
                    styles.metaText,
                    { color: themeStyles.muted },
                  ]}
                >
                  {dish.timeAgo}
                </Text>
              </View>
            )}
          </View>

          {/* Description */}
          {dish.description ? (
            <View style={{ marginTop: 12 }}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: themeStyles.text },
                ]}
              >
                Description
              </Text>
              <Text
                style={[
                  styles.description,
                  { color: themeStyles.text },
                ]}
              >
                {dish.description}
              </Text>
            </View>
          ) : null}

          {/* Comments */}
          <View style={{ marginTop: 16 }}>
            <Text
              style={[
                styles.sectionTitle,
                { color: themeStyles.text },
              ]}
            >
              Comments ({commentsCount})
            </Text>
            {commentsCount > 0 ? (
              comments.map((c) => {
                const displayAuthor = getDisplayAuthor(c);
                const avatarInitial =
                  displayAuthor?.[0]?.toUpperCase() || "U";

                return (
                  <View key={c.id} style={styles.commentRow}>
                    <View style={styles.commentAvatar}>
                      <Text style={styles.commentAvatarText}>
                        {avatarInitial}
                      </Text>
                    </View>
                    <View style={styles.commentBody}>
                      <Text
                        style={[
                          styles.commentAuthor,
                          { color: themeStyles.text },
                        ]}
                      >
                        {displayAuthor}
                        <Text
                          style={[
                            styles.commentTime,
                            { color: themeStyles.muted },
                          ]}
                        >
                          {"  · "}
                          {c.timeAgo || ""}
                        </Text>
                      </Text>
                      <Text
                        style={[
                          styles.commentText,
                          { color: themeStyles.text },
                        ]}
                      >
                        {c.text}
                      </Text>
                    </View>
                  </View>
                );
              })
            ) : (
              <Text
                style={{
                  color: themeStyles.muted,
                  marginTop: 4,
                  fontSize: 13,
                }}
              >
                No comments yet. Be the first to comment!
              </Text>
            )}
          </View>

          {/* Add comment box */}
          <View style={{ marginTop: 14 }}>
            <Text
              style={[
                styles.sectionTitle,
                { color: themeStyles.text, marginBottom: 6 },
              ]}
            >
              Add a comment
            </Text>
            <View style={styles.commentInputRow}>
              <TextInput
                style={[
                  styles.commentInput,
                  {
                    backgroundColor: themeStyles.card,
                    color: themeStyles.text,
                  },
                ]}
                placeholder="Write a comment..."
                placeholderTextColor={themeStyles.muted}
                value={commentText}
                onChangeText={setCommentText}
              />
              <TouchableOpacity
                style={styles.commentSendButton}
                onPress={handleAddComment}
                activeOpacity={0.8}
              >
                <Ionicons name="send" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DishDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  image: {
    width: "100%",
    height: 260,
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
  },
  placeName: {
    fontSize: 14,
    marginTop: 2,
  },
  ownerText: {
    fontSize: 12,
    marginTop: 2,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  likeCount: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    marginTop: 8,
    alignItems: "center",
  },
  address: {
    fontSize: 13,
    marginLeft: 4,
  },
  mapsButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  mapsButtonText: {
    fontSize: 13,
    marginLeft: 6,
    fontWeight: "500",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginTop: 4,
  },
  metaText: {
    fontSize: 12,
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  description: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  commentRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ff6247",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  commentAvatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  commentBody: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: "600",
  },
  commentTime: {
    fontSize: 11,
  },
  commentText: {
    fontSize: 13,
    marginTop: 2,
  },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  commentInput: {
    flex: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
  },
  commentSendButton: {
    marginLeft: 8,
    backgroundColor: "#ff6247",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
