import React, { createContext, useState } from "react";

export const DishContext = createContext();

// Demo posts (initial data)
const demoDishes = [
  {
    id: 1,
    name: "Sushi Platter",
    description: "Fresh salmon, tuna, tamago — the perfect combo.",
    category: "Filipino", // OR change to Japanese if you want
    image: require("../assets/dish1.jpg"),
  },
  {
    id: 2,
    name: "Tonkotsu Ramen",
    description: "Rich pork broth with tender chashu slices.",
    category: "Korean",
    image: require("../assets/dish2.jpg"),
  },
  {
    id: 3,
    name: "Chocolate Cake Slice",
    description: "Moist, creamy, and perfect for dessert lovers.",
    category: "Dessert",
    image: require("../assets/dish3.jpg"),
  },
  {
    id: 4,
    name: "Iced Caramel Latte",
    description: "Cold, sweet, and refreshing — merienda essential.",
    category: "Drinks",
    image: require("../assets/dish4.jpg"),
  },
];

// Auto-increment base (starts after demo IDs)
let nextId = demoDishes.length + 1;

export const DishProvider = ({ children }) => {
  const [dishes, setDishes] = useState(demoDishes);

  const addDish = (dish) => {
    setDishes([...dishes, { ...dish, id: nextId++ }]);
  };

  const editDish = (id, updatedDish) => {
    setDishes(dishes.map((d) => (d.id === id ? { ...d, ...updatedDish } : d)));
  };

  return (
    <DishContext.Provider value={{ dishes, addDish, editDish }}>
      {children}
    </DishContext.Provider>
  );
};
