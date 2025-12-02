// App.js
import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { DishProvider } from "./context/DishContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppStack from "./navigation/AppStack";

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <DishProvider>
          <AppStack />
        </DishProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
