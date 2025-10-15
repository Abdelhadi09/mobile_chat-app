import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token from storage on app start
  useEffect(() => {
    const loadToken = async () => {
      try {
        const savedToken = await SecureStore.getItemAsync("token");
        const savedUsername = await SecureStore.getItemAsync("username");
        if (savedToken) {
          setToken(savedToken);
          setUsername(savedUsername);
        }
      } catch (e) {
        console.log("Error loading token:", e);
      } finally {
        setLoading(false);
      }
    };
    loadToken();
  }, []);

  const login = async (token, username) => {
    setToken(token);
    setUsername(username);
    await SecureStore.setItemAsync("token", token);
    await SecureStore.setItemAsync("username", username);
  };

  const logout = async () => {
    setToken(null);
    setUsername(null);
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("username");
  };

  return (
    <AuthContext.Provider value={{ token, username, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
