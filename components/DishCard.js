import React, { useContext } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { DishContext } from "../context/DishContext";

const DishCard = ({ dish = {}, onPress = () => {} }) => {
  const { toggleLike } = useContext(DishContext);

  // Ensure image is in proper format
  const imageSource =
    typeof dish.image === "string" ? { uri: dish.image } : dish.image;

  return (
    <TouchableOpacity onPress={() => onPress(dish)} style={styles.card}>
      {imageSource ? (
        <Image source={imageSource} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name}>{dish.name || "Unnamed Dish"}</Text>
        <Text style={styles.description}>{dish.description || "No description"}</Text>
        <Text style={styles.category}>{dish.category || "Uncategorized"}</Text>

        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => toggleLike && toggleLike(dish.id)}
            disabled={!toggleLike}
          >
            <Text style={styles.like}>
              {dish.liked ? "❤️" : "🤍"} {dish.likes || 0}
            </Text>
          </TouchableOpacity>

          <Text style={styles.comments}>
            💬 {dish.comments?.length || 0} comments
          </Text>
        </View>

        {dish.timestamp && <Text style={styles.time}>{dish.timestamp}</Text>}
      </View>
    </TouchableOpacity>
  );
};

export default DishCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#fff",
    elevation: 2,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  placeholder: {
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#888",
    fontSize: 12,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 17,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  category: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    marginTop: 8,
    alignItems: "center",
    gap: 16,
  },
  like: {
    fontSize: 15,
  },
  comments: {
    fontSize: 14,
    color: "#444",
  },
  time: {
    fontSize: 11,
    color: "#999",
    marginTop: 5,
  },
});
