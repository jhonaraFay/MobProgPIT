// components/DishCard.js
import React, { useContext, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { DishContext } from "../context/DishContext";
import { ThemeContext } from "../context/ThemeContext";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const DishCard = ({ dish = {}, onPress = () => {} }) => {
  const { toggleLike } = useContext(DishContext);
  const { styles: themeStyles } = useContext(ThemeContext);

  const imageSource =
    typeof dish.image === "string" ? { uri: dish.image } : dish.image;

  const distanceText =
    typeof dish.distanceKm === "number"
      ? dish.distanceKm < 1
        ? `${Math.round(dish.distanceKm * 1000)} m away`
        : `${dish.distanceKm.toFixed(1)} km away`
      : null;

  const commentsCount = Array.isArray(dish.comments)
    ? dish.comments.length
    : typeof dish.comments === "number"
    ? dish.comments
    : 0;

  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      friction: 6,
      tension: 200,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
      tension: 200,
    }).start();
  };

  const handleLikePress = () => {
    if (!toggleLike || dish?.id == null) return;
    toggleLike(dish.id);
  };

  const handleCardPress = () => {
    // ensure card animates back even if user taps quickly
    handlePressOut();
    onPress(dish);
  };

  return (
    <AnimatedTouchable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handleCardPress}
      activeOpacity={0.95}
      style={[
        styles.card,
        {
          backgroundColor: themeStyles.card,
          borderColor: themeStyles.border,
          transform: [{ scale }],
        },
      ]}
    >
      {/* Image */}
      {imageSource ? (
        <Image source={imageSource} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Ionicons
            name="image-outline"
            size={32}
            color={themeStyles.muted}
          />
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {/* Top row: title + like button */}
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.name,
                { color: themeStyles.text },
              ]}
              numberOfLines={1}
            >
              {dish.name || "Untitled dish"}
            </Text>
            {dish.placeName ? (
              <Text
                style={[
                  styles.placeName,
                  { color: themeStyles.text },
                ]}
                numberOfLines={1}
              >
                {dish.placeName}
              </Text>
            ) : null}
          </View>

          <TouchableOpacity
            onPress={handleLikePress}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <View style={styles.likeButton}>
              <Ionicons
                name={dish.liked ? "heart" : "heart-outline"}
                size={22}
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

        {/* Address / distance / category */}
        {(dish.address || distanceText || dish.category) && (
          <View style={styles.metaBlock}>
            {dish.address ? (
              <Text
                style={[
                  styles.address,
                  { color: themeStyles.muted },
                ]}
                numberOfLines={1}
              >
                {dish.address}
              </Text>
            ) : null}

            <View style={styles.locationRow}>
              {distanceText ? (
                <>
                  <Ionicons
                    name="location-outline"
                    size={14}
                    color={themeStyles.muted}
                  />
                  <Text
                    style={[
                      styles.locationText,
                      { color: themeStyles.muted },
                    ]}
                  >
                    {distanceText}
                  </Text>
                </>
              ) : null}
              {dish.category ? (
                <>
                  {distanceText && <View style={styles.dot} />}
                  <Ionicons
                    name="restaurant-outline"
                    size={14}
                    color={themeStyles.muted}
                  />
                  <Text
                    style={[
                      styles.locationText,
                      { color: themeStyles.muted },
                    ]}
                  >
                    {dish.category}
                  </Text>
                </>
              ) : null}
            </View>
          </View>
        )}

        {/* Bottom row: comments + time */}
        <View style={styles.bottomRow}>
          <View style={styles.bottomLeft}>
            {commentsCount > 0 && (
              <View style={styles.bottomItem}>
                <Ionicons
                  name="chatbubble-outline"
                  size={14}
                  color={themeStyles.muted}
                />
                <Text
                  style={[
                    styles.bottomText,
                    { color: themeStyles.muted },
                  ]}
                >
                  {commentsCount}
                </Text>
              </View>
            )}
          </View>
          {dish.timeAgo ? (
            <Text
              style={[
                styles.bottomText,
                { color: themeStyles.muted },
              ]}
            >
              {dish.timeAgo}
            </Text>
          ) : null}
        </View>
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: StyleSheet.hairlineWidth,
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
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
  },
  placeName: {
    marginTop: 2,
    fontSize: 13,
    opacity: 0.9,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  likeCount: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  metaBlock: {
    marginTop: 6,
  },
  address: {
    fontSize: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    marginLeft: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#666",
    marginHorizontal: 6,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  bottomLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  bottomItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  bottomText: {
    fontSize: 11,
    marginLeft: 4,
  },
});

export default DishCard;
