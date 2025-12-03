// context/DishContext.js
import React, { createContext, useState } from "react";

export const DishContext = createContext();

const demoDishes = [
  {
    id: 1,
    name: "Variety of foods",
    description: "Yummy foods",
    category: "Filipino",
    placeName: "Faspecc",
    address: "USTP Cdo",
    latitude: 8.485199,
    longitude: 124.656749,
    image: require("../assets/dish1.jpg"),
    ownerUsername: "foodie_jane",
    likes: 24,
    liked: false,
    timeAgo: "2h ago",
    comments: [
      {
        id: "c1",
        author: "foodlover",
        text: "Looks so fresh! 🤤",
        timeAgo: "1h ago",
        authorIsCurrentUser: false,
      },
      {
        id: "c2",
        author: "ustpfan",
        text: "Wow so yummy?",
        timeAgo: "45m ago",
        authorIsCurrentUser: false,
      },
    ],
  },
  {
    id: 2,
    name: "BBQ",
    description: "Yummy bbq for affordable prices!",
    category: "Filipino",
    placeName: "Mommys BBQ",
    address: "Valenzuela Rd, Cagayan De Oro City, Misamis Oriental",
    latitude: 8.484722 ,
    longitude: 124.658508,
    image: require("../assets/dish2.jpg"),
    ownerUsername: "ramen_king",
    likes: 18,
    liked: false,
    timeAgo: "4h ago",
    comments: [
      {
        id: "c3",
        author: "ramenqueen",
        text: "My favorite bbq🤩",
        timeAgo: "3h ago",
        authorIsCurrentUser: false,
      },
    ],
  },
  {
    id: 3,
    name: "Pater",
    description: "Yummy pater so yummy",
    category: "Filipino",
    placeName: "Harry Pater",
    address: "Sergio Osmeña Street, Poblacion, Cagayan de Oro",
    latitude: 8.484757 ,
    longitude: 124.653667,
    image: require("../assets/dish3.jpg"),
    ownerUsername: "harry_potter",
    likes: 32,
    liked: false,
    timeAgo: "1d ago",
    comments: [
      {
        id: "c4",
        author: "juan",
        text: "Legit pater rapsa🔥",
        timeAgo: "20h ago",
        authorIsCurrentUser: false,
      },
    ],
  },
  {
    id: 4,
    name: "Chicken Tenders",
    description: "Chicken tenders, smash burgers and more!",
    category: "Pamahaw",
    placeName: "Frkn Brgrs",
    address: "8 Domingo Velez St, Cagayan De Oro City",
    latitude: 8.479296,
    longitude: 124.648123,
    image: require("../assets/dish4.jpg"),
    ownerUsername: "yummymyhotdogmytummy",
    likes: 41,
    liked: false,
    timeAgo: "3d ago",
    comments: [
      {
        id: "c5",
        author: "whou",
        text: "Perfect for summer! ☀️",
        timeAgo: "2d ago",
        authorIsCurrentUser: false,
      },
    ],
  },
  {
    id: 5,
    name: "Fried Chicken",
    description: "Fried chicken with yummy the tummy",
    category: "Filipino",
    placeName: "Chicken Rotizado",
    address: "37 Hayes St, Cagayan De Oro City",
    latitude: 8.475433 ,
    longitude: 124.653521,
    image: require("../assets/dish5.jpg"),
    ownerUsername: "riceislife",
    likes: 12,
    liked: false,
    timeAgo: "5d ago",
    comments: [
      {
        id: "c6",
        author: "riceislife",
        text: "Fried chicken please 😍",
        timeAgo: "4d ago",
        authorIsCurrentUser: false,
      },
    ],
  },
];

let nextId = demoDishes.length + 1;

export const DishProvider = ({ children }) => {
  const [dishes, setDishes] = useState(demoDishes);

  const addDish = (dish) => {
    const newDish = {
      id: nextId++,
      likes: 0,
      liked: false,
      timeAgo: "Just now",
      comments: [],
      ...dish,
    };
    setDishes((prev) => [...prev, newDish]);
  };

  const editDish = (id, updatedDish) => {
    setDishes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updatedDish } : d))
    );
  };

  const toggleLike = (id) => {
    setDishes((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const liked = !d.liked;
        const baseLikes = typeof d.likes === "number" ? d.likes : 0;
        const likes = liked ? baseLikes + 1 : Math.max(baseLikes - 1, 0);
        return { ...d, liked, likes };
      })
    );
  };

  /**
   * Add a comment.
   * author: string to fall back to (e.g. name when it was created)
   * options: { isCurrentUser: boolean }
   *
   * For comments by the logged-in user, we set authorIsCurrentUser = true.
   * When rendering, we will override the name with the user's CURRENT displayName/username.
   */
  const addComment = (dishId, author, text, options = {}) => {
    const trimmed = text?.trim();
    if (!trimmed) return;

    const isCurrentUser = !!options.isCurrentUser;

    setDishes((prev) =>
      prev.map((d) => {
        if (d.id !== dishId) return d;
        const existing = Array.isArray(d.comments) ? d.comments : [];
        const newComment = {
          id: `c_${Date.now()}_${Math.random()
            .toString(36)
            .slice(2, 6)}`,
          author: author || "User",
          text: trimmed,
          timeAgo: "Just now",
          authorIsCurrentUser: isCurrentUser,
        };
        return { ...d, comments: [...existing, newComment] };
      })
    );
  };

  return (
    <DishContext.Provider
      value={{ dishes, addDish, editDish, toggleLike, addComment }}
    >
      {children}
    </DishContext.Provider>
  );
};
