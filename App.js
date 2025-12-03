// App.js
import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { DishProvider } from "./context/DishContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LocationProvider } from "./context/LocationContext";
import AppStack from "./navigation/AppStack";

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LocationProvider>
          <DishProvider>
            <AppStack />
          </DishProvider>
        </LocationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
