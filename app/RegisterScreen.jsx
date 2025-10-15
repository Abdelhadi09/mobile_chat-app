import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ImageBackground, 
  StyleSheet 
} from "react-native";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  return (
    <ImageBackground 
      source={require("../assets/bg.jpg")} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Register</Text>

          <TextInput
            placeholder="Username"
            placeholderTextColor="#999"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#999"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TextInput
            placeholder="email"
            placeholderTextColor="#999"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button}
          onPress={() => alert(`Logging in as ${username}`)}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

         
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    alignItems: "center",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 25,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    color: "#333",
    marginBottom: 20,
    fontFamily: "SourGummy_600SemiBold",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#f5c6da",
    marginBottom: 15,
    fontFamily: "SourGummy_400Regular",
  },
  button: {
    backgroundColor: "#f8a1d1",
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "SourGummy_600SemiBold",
  },
  footerText: {
    marginTop: 15,
    color: "#555",
    fontFamily: "SourGummy_400Regular",
    display: "inline",
  },
  signup: {
    color: "#f58ac0",
    fontWeight: "bold",
    fontFamily: "SourGummy_600SemiBold",
  },
});
