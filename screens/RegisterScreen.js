// screens/RegisterScreen.js
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

const RegisterScreen = ({ navigation }) => {
  const { register } = useContext(AuthContext);
  const { styles: theme } = useContext(ThemeContext) || {};

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Please enter username and password.");
      return;
    }

    const ok = await register(username.trim(), password.trim());

    if (!ok) {
      Alert.alert("Error", "Failed to register. Please try again.");
      return;
    }

    Alert.alert(
      "Account created",
      "Your account has been registered. You can now log in.",
      [
        {
          text: "OK",
          onPress: () => navigation.goBack(), // back to Login
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme?.background || "#fff" },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: theme?.text || "#000" },
        ]}
      >
        Create account
      </Text>

      {/* Username */}
      <TextInput
        placeholder="Username"
        placeholderTextColor={theme?.muted || "#888"}
        style={[
          styles.input,
          {
            backgroundColor: theme?.card || "#f0f0f0",
            color: theme?.text || "#000",
          },
        ]}
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />

      {/* Password with toggle */}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          placeholderTextColor={theme?.muted || "#888"}
          style={[
            styles.input,
            {
              backgroundColor: theme?.card || "#f0f0f0",
              color: theme?.text || "#000",
              flex: 1,
              marginBottom: 0,
            },
          ]}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={{ paddingHorizontal: 8 }}
        >
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={22}
            color={theme?.muted || "#888"}
          />
        </TouchableOpacity>
      </View>

      {/* Register button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#ff6247" }]}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      {/* Back to login */}
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: theme?.card || "#eee",
            marginTop: 12,
          },
        ]}
        onPress={() => navigation.goBack()}
      >
        <Text
          style={[
            styles.buttonText,
            { color: theme?.text || "#000" },
          ]}
        >
          Back to Login
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  button: {
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 17,
    color: "#fff",
    fontWeight: "bold",
  },
});
