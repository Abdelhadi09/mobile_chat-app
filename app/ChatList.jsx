import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigation } from "expo-router";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

export default function ChatListScreen() {
  const local = "http://192.168.23.83:5000"; // your server URL
  const { token, username } = useContext(AuthContext);

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [lastMessages, setLastMessages] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const navigation = useNavigation();

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${local}/api/messages/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    if (token) fetchUsers();
  }, [token]);

  // Fetch last messages
  useEffect(() => {
    const fetchLastMessages = async () => {
      try {
        const res = await axios.get(`${local}/api/messages/last`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLastMessages(res.data);
      } catch (err) {
        console.error("Error fetching last messages:", err);
      }
    };
    if (token) fetchLastMessages();
  }, [token]);

  // Filter when searching
  useEffect(() => {
    if (!search.trim()) setFiltered(users);
    else {
      const results = users.filter((u) =>
        u.username.toLowerCase().includes(search.toLowerCase())
      );
      setFiltered(results);
    }
  }, [search, users]);

const fetchProfilePic = async () => {
    try {
      const res = await axios.get(`${local}/api/auth/profile `, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfilePic(res.data.profilePic);
    } catch (err) {
      console.error("Error fetching profile picture:", err);
    }
  };

  useEffect(() => {
    if (token && username) fetchProfilePic();
  }, [token, username]);


  // Render each user chat
  const renderChatItem = ({ item }) => {
    const lastMsg = lastMessages[item.username];
    let preview = "";

    if (lastMsg) {
      if (lastMsg.content) preview = lastMsg.content;
      else if (lastMsg.fileType) preview = `Sent a ${lastMsg.fileType}`;
    }

    return (
      <TouchableOpacity style={styles.chatItem}>
        <Image
          source={
            item.profilePic
              ? { uri: item.profilePic }
              : require("../assets/icon.png")
          }
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("Chat", { recipient: item.username , profilePic: item.profilePic } )}>
          <Text style={styles.name}>{item.username}</Text>
          <Text style={styles.message} numberOfLines={1}>
            {preview || "No messages yet"}
          </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.profile}> 
        <Image
  source={
    profilePic
      ? { uri: profilePic } // ✅ use { uri: ... } for remote images
      : require("../assets/icon.png") // ✅ static fallback for local asset
  }
  style={styles.bottomAvatar}
/>

        <Text style={styles.header}>Chats</Text>
          </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search for users..."
          placeholderTextColor="#999"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Chat List */}
      <FlatList
        data={filtered}
        renderItem={renderChatItem}
        keyExtractor={(item) => item._id}
        style={styles.chatList}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#777" }}>
            No users found
          </Text>
        }
      />
    </View>
  );
}

// 💅 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffe6f2",
    paddingHorizontal: 15,
    paddingTop: 40,
    fontFamily: "SourGummy_600SemiBold",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 10,
    display : "inline",
  },
  searchContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#f5c6da",
    paddingHorizontal: 15,
    paddingVertical: 6,
    marginBottom: 20,
  },
  searchInput: {
    fontSize: 14,
    color: "#333",
  },
  chatList: {
    flex: 1,
    fontFamily: "SourGummy_600SemiBold",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9c7e5",
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 15,
  },
  message: {
    color: "#555",
    fontSize: 13,
  },
  profile: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 20, 
  },
  bottomAvatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    marginRight: 10, 
  },
  bottomBubble: { 
    backgroundColor: "#f8a1d1", 
    borderRadius: 15, 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    maxWidth: "70%", 
    alignSelf: "flex-start", 
    marginLeft: 10, 
  },
  
});
