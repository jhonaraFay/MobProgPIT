// LoginScreen.js
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const { styles: theme } = useContext(ThemeContext) || {};

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Validation", "Please enter username and password.");
      return;
    }

    const ok = await login(username.trim(), password);
    if (!ok) {
      Alert.alert("Login Failed", "Invalid credentials");
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme?.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.inner}>
        <Text style={[styles.title, { color: theme?.text }]}>Welcome back</Text>
        <Text style={[styles.subtitle, { color: theme?.muted }]}>
          Login to continue
        </Text>

        <TextInput
          placeholder="Username"
          placeholderTextColor={theme?.muted}
          style={[
            styles.input,
            { backgroundColor: theme?.card, color: theme?.text },
          ]}
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor={theme?.muted}
          style={[
            styles.input,
            { backgroundColor: theme?.card, color: theme?.text },
          ]}
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerBtn}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={[styles.registerText, { color: theme?.muted }]}>
            Don’t have an account? <Text style={{ color: "#ff6247" }}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  inner: { width: "100%", alignItems: "center" },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  input: {
    width: "100%",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  loginBtn: {
    width: "100%",
    backgroundColor: "#ff6247",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 6,
  },
  loginText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  registerBtn: {
    marginTop: 18,
  },
  registerText: {
    fontSize: 13,
  },
});
