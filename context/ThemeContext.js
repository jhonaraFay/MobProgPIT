// context/ThemeContext.js
import React, { createContext, useState, useContext } from "react";

export const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark"); // default to dark for TikTok-ish vibe

  const isLight = theme === "light";

  const palette = isLight
    ? {
        background: "#fdfdfd",
        card: "#ffffff",
        text: "#111111",
        muted: "#777777",
        border: "#e3e3e3",
        tabBar: "rgba(255,255,255,0.92)",
      }
    : {
        background: "#050505",
        card: "#111111",
        text: "#f9f9f9",
        muted: "#9a9a9a",
        border: "#262626",
        tabBar: "rgba(10,10,10,0.94)",
      };

  const styles = {
    background: palette.background,
    card: palette.card,
    text: palette.text,
    muted: palette.muted,
    border: palette.border,
    tabBar: palette.tabBar,
    primary: "#ff6247",
  };

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, styles }}>
      {children}
    </ThemeContext.Provider>
  );
};
