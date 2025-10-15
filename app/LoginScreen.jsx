import React, { useState , useContext } from "react";
import axios from "axios";
import { useNavigation } from "expo-router";
import { AuthContext } from "../contexts/AuthContext";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ImageBackground, 
  StyleSheet 
} from "react-native";

export default function LoginScreen() {
 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
const { login } = useContext(AuthContext);
  const render_url = "https://messaging-app-1-exy2.onrender.com";
  const local = "http://192.168.23.83:5000"
  const hundleLogin = async (username , password) => {
    try {
      const response = await axios.post(`${local}/api/auth/login`, {
        username,
        password,
      });

      if (response.status === 200) {
         const { token, username: name } = response.data;

      await login(token, name); // Save globally
        alert("Login successful!");
        navigation.navigate("ChatList");
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <ImageBackground 
      source={require("../assets/bg.jpg")} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Login</Text>

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

          <TouchableOpacity style={styles.button}
          onPress={() => hundleLogin(username, password)}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
  Don’t have an account?{" "}
  <Text 
    style={styles.signup} 
    onPress={() => navigation.navigate("Register")}
  >
    Sign up
  </Text>
</Text>

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
