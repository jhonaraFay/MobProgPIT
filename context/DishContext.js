// DishContext.js
import React, { createContext, useState } from "react";

export const DishContext = createContext();

let nextId = 4; // since we have 3 demo posts

export const DishProvider = ({ children }) => {
  const [dishes, setDishes] = useState([
    {
      id: 1,
      name: "Sushi Platter",
      description: "Fresh salmon sushi served beautifully.",
      category: "Japanese",
      image: require("../assets/dish1.jpg"), // IMPORTANT: no uri
      likes: 24,
      liked: false,
      comments: [
        { id: 1, username: "foodieMark", text: "Looks amazing!" },
        { id: 2, username: "sushiQueen", text: "This is my fave!" },
      ],
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      name: "Creamy Carbonara",
      description: "Rich and creamy pasta with parmesan.",
      category: "Italian",
      image: require("../assets/dish2.jpg"),
      likes: 18,
      liked: false,
      comments: [
        { id: 1, username: "chefRon", text: "Perfect texture!" },
      ],
      timestamp: "Yesterday",
    },
    {
      id: 3,
      name: "Chicken Adobo",
      description: "Classic Filipino dish with soy + vinegar.",
      category: "Filipino",
      image: require("../assets/dish3.jpg"),
      likes: 50,
      liked: true,
      comments: [
        { id: 1, username: "pinoyFoodLover", text: "Sarap nito!" },
        { id: 2, username: "maria", text: "Luto mo ba to? haha" },
      ],
      timestamp: "3 days ago",
    },
  ]);

  const addComment = (dishId, commentText) => {
    setDishes(prev =>
      prev.map(d =>
        d.id === dishId
          ? {
              ...d,
              comments: [
                ...d.comments,
                {
                  id: d.comments.length + 1,
                  username: "you",
                  text: commentText,
                },
              ],
            }
          : d
      )
    );
  };

  const toggleLike = (dishId) => {
    setDishes(prev =>
      prev.map(d =>
        d.id === dishId
          ? {
              ...d,
              liked: !d.liked,
              likes: d.liked ? d.likes - 1 : d.likes + 1,
            }
          : d
      )
    );
  };

  return (
    <DishContext.Provider value={{ dishes, toggleLike, addComment }}>
      {children}
    </DishContext.Provider>
  );
};
