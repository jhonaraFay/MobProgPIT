// context/AuthContext.js
import React, { createContext, useState } from "react";

export const AuthContext = createContext();

const DEFAULT_BIO =
  "Sharing my favorite Filipino & Japanese dishes 🍣🍜";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registeredUser, setRegisteredUser] = useState(null);

  /**
   * Register a new user in-memory.
   * For demo only: we store a single user and keep it while the app is open.
   */
  const register = async (username, password) => {
    const trimmedUser = username?.trim();
    if (!trimmedUser || !password) return false;

    const newUser = {
      username: trimmedUser,
      password,
      displayName: trimmedUser,
      bio: DEFAULT_BIO,
      avatarUri: null,
    };

    setRegisteredUser(newUser);
    return true;
  };

  /**
   * Login: only works if the credentials match the registeredUser.
   */
  const login = async (username, password) => {
    const trimmedUser = username?.trim();
    if (!trimmedUser || !password) return false;

    if (
      !registeredUser ||
      registeredUser.username !== trimmedUser ||
      registeredUser.password !== password
    ) {
      return false;
    }

    setUser({
      username: registeredUser.username,
      displayName: registeredUser.displayName,
      bio: registeredUser.bio,
      avatarUri: registeredUser.avatarUri,
    });

    return true;
  };

  const logout = () => {
    setUser(null);
  };

  /**
   * Update profile info (displayName, bio, avatarUri).
   * Keeps it in both the current session user and registeredUser.
   */
  const updateProfile = (fields) => {
    setUser((prev) => (prev ? { ...prev, ...fields } : prev));
    setRegisteredUser((prev) => (prev ? { ...prev, ...fields } : prev));
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};
