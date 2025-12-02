// RegisterScreen.js
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
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

const RegisterScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const { styles: theme } = useContext(ThemeContext) || {};

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Missing Fields", "Please enter username and password");
      return;
    }

    // Mock register & login
    const ok = await login(username.trim(), password.trim());
    if (!ok) {
      Alert.alert("Error", "Failed to register. Try again.");
    } else {
      Alert.alert("Success", "Registered and logged in successfully!");
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme?.background || "#fff" }]}>
      <Text style={[styles.title, { color: theme?.text || "#000" }]}>Register</Text>

      {/* Username Input */}
      <TextInput
        placeholder="Username"
        placeholderTextColor={theme?.muted || "#888"}
        style={[styles.input, { backgroundColor: theme?.card || "#f0f0f0", color: theme?.text || "#000" }]}
        value={username}
        onChangeText={setUsername}
      />

      {/* Password Input with Toggle */}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          placeholderTextColor={theme?.muted || "#888"}
          style={[styles.input, { backgroundColor: theme?.card || "#f0f0f0", color: theme?.text || "#000", flex: 1 }]}
          value={password}
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={24}
            color={theme?.muted || "#888"}
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>

      {/* Register Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#ff6247" }]}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      {/* Back to Login */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme?.card || "#eee", marginTop: 12 }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.buttonText, { color: theme?.text || "#000" }]}>Back to Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 30, textAlign: "center" },
  input: { borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 15 },
  passwordContainer: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  button: { padding: 15, borderRadius: 12, alignItems: "center" },
  buttonText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
});
