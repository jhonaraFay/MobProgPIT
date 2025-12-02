import React, { createContext, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const styles = {
    background: theme === "light" ? "#fff" : "#222",
    card: theme === "light" ? "#eee" : "#333",
    text: theme === "light" ? "#000" : "#fff",
    muted: theme === "light" ? "#888" : "#aaa",
  };

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, styles }}>
      {children}
    </ThemeContext.Provider>
  );
};
