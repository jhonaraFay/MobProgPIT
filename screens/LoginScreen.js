// LoginScreen.js
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const { styles: theme } = useContext(ThemeContext) || {};

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Validation', 'Please enter username and password');
      return;
    }

    const ok = await login(username.trim(), password);
    if (!ok) {
      Alert.alert('Login Failed', 'Invalid credentials');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.background || '#fff' }]}>
      <Text style={[styles.title, { color: theme?.text || '#000' }]}>Login</Text>

      <TextInput
        placeholder="Username"
        placeholderTextColor={theme?.muted || '#888'}
        style={[styles.input, { backgroundColor: theme?.card || '#eee', color: theme?.text || '#000' }]}
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor={theme?.muted || '#888'}
        style={[styles.input, { backgroundColor: theme?.card || '#eee', color: theme?.text || '#000' }]}
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      <View style={styles.buttonContainer}>
        <Button title="Login" color="#ff6247" onPress={handleLogin} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Register" color="#888" onPress={() => navigation.navigate('Register')} />
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  input: { borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16 },
  buttonContainer: { marginVertical: 8 },
});
