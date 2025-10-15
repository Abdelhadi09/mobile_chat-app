
import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
    ImageBackground,
} from "react-native";
import { Audio } from "expo-av";
import { AuthContext } from "../contexts/AuthContext";
import pusher from "../config/pusher";
import axios from "axios";
import { local , PUSHER_KEY, PUSHER_CLUSTER } from '@env';
import * as DocumentPicker from 'expo-document-picker';
const { width } = Dimensions.get("window");

export default function ChatScreen({ route }) {
  const { recipient , profilePic } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [typing, setTyping] = useState(false);
 
  const { token, username } = useContext(AuthContext);

  // Pusher setup
  useEffect(() => {

    const channel = pusher.subscribe('chat-room');

    channel.bind('typing', (data) => {
      if (data.sender === recipient) {
        setTyping(true);
        setTimeout(() => setTyping(false), 2000);
      }
    });

    channel.bind('new-message', (data) => {
      if (data.sender === recipient || data.recipient === recipient) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });

    channel.bind('message-delivered', (data) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === data.messageId ? { ...msg, delivered: true } : msg
        )
      );
    });

    channel.bind('message-seen', (data) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === data.messageId ? { ...msg, seen: true } : msg
        )
      );
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [recipient]);
// handle picking file
const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "video/*", "audio/*"],
        copyToCacheDirectory: true,
      });
      if (result.assets && result.assets.length > 0) {
        setFile(result.assets[0]);
      }
    } catch (error) {
      console.error("File picking error:", error);
    }
  };

// hundle sending 

   const handleSend = async () => {
    if (!input.trim() && !file) {
      Alert.alert("Nothing to send", "Please type a message or pick a file.");
      return;
    }

    try {
      // --- Send text message ---
      if (input.trim()) {
        const res = await axios.post(
          `${local}/api/messages`,
          { content: input, recipient },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages((prev) => [...prev, res.data]);
        setInput("");
      }

      // --- Send file ---
      if (file) {
        const formData = new FormData();
        formData.append("file", {
          uri: file.uri,
          name: file.name || "upload",
          type: file.mimeType || "application/octet-stream",
        });
        formData.append("recipient", recipient);

        const res = await axios.post(`${local}/api/messages/upload`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        setMessages((prev) => [...prev, res.data.data]);
        setFile(null);
      }
    } catch (err) {
      console.error("Failed to send message or upload file:", err);
    }
  };

  //handle typing

   const handleTyping = () => {
    axios.post(
      `${local}/api/messages/typing`,
      { recipient },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

// fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${local}/api/messages/private/${recipient}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, [recipient, token]);

  const playAudio = async (url) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: url });
      await sound.playAsync();
    } catch (error) {
      console.error("Audio play error:", error);
    }
  };

  const renderMessage = ({ item }) => {
    const isSender = item.sender === username;
    return (
      <View
        style={[
          styles.messageContainer,
          isSender ? styles.rightMessage : styles.leftMessage,
        ]}
      >
        {/* Image message */}
        {item.fileType === "image" && (
          <Image source={{ uri: item.fileUrl }} style={styles.imageMessage} />
        )}

        {/* Audio message */}
        {item.fileType === "video" && (
          <TouchableOpacity
            style={styles.audioContainer}
            onPress={() => playAudio(item.fileUrl)}
          >
            <Text style={styles.audioText}>▶ Audio message</Text>
          </TouchableOpacity>
        )}

        {/* Text message */}
        {!item.fileType && <Text style={styles.messageText}>{item.content}</Text>}

        {/* Timestamp */}
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  };

  return (
   

    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
                  source={
                    profilePic
                      ? { uri: profilePic }
                      : require("../assets/icon.png")
                  }
                  style={styles.avatar}
                />
        <Text style={styles.headerText}>{recipient}</Text>
        <TouchableOpacity>
          <Image source={require("../assets/telephone.png")} style={styles.callIcon} />
        </TouchableOpacity>
      </View>

      {/* Messages list */}
      <Image
        source={require("../assets/bg.jpg")} // optional background pattern
        style={styles.bg}
      />
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 15 }}
      />

     {/* Input bar */}
<View style={styles.inputContainer}>
  {/* Plus button */}

   <TouchableOpacity style={styles.cameraButton} onPress={handlePickFile}>
    <Text style={{ color: '#555', fontSize: 20 }}>+</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.cameraButton}>
    <Image
      source={require("../assets/camera.png")}
      style={{ width: 20, height: 20 }}
    />
  </TouchableOpacity>
  

  {/* Input wrapper with icons inside */}
  <View style={styles.inputWrapper}>
    <TextInput
  style={styles.textInput}
  placeholder="Chat..."
  placeholderTextColor="#999"
  value={input}
  onChangeText={(text) => {
    setInput(text);
    handleTyping();
  }}
/>

    <TouchableOpacity style={styles.micIcon}>
      <Image
        source={require("../assets/microphone.png")}
        style={{ width: 20, height: 20 }}
      />
    </TouchableOpacity>
  </View>

  {/* Send button */}
  <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
    <Image
      source={require("../assets/envoyer.png")}
      style={{ width: 22, height: 22 }}
    />
  </TouchableOpacity>
</View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "treansparent",
    fontFamily: "SourGummy_600SemiBold",
  },
  bg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.5,
    zIndex: -1,
  },
   
  header: {
    flexDirection: "row",
    alignItems: "center",
  
    paddingHorizontal: 15,
    paddingTop: 30,
   borderBottomColor: "#ddd",
   borderBottomWidth: 1,
   paddingBottom: 10,
   backgroundColor: "#f7f7f7",
   borderBottomEndRadius: 20,
   borderBottomStartRadius: 20,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginRight: 10,
  },
  headerText: {
    flex: 1,
    fontWeight: "bold",
    color: "#222",
    fontSize: 16,
    fontFamily: "SourGummy_600SemiBold",
  },
  callIcon: {
    fontSize: 15,
  },
  messageContainer: {
    maxWidth: width * 0.7,
    padding: 10,
    borderRadius: 24,
    marginVertical: 5,
  },
  leftMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 0,
    borderColor : "#ddd",
  },
  rightMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#ffe2f8",
    borderBottomRightRadius: 0,
  },
  messageText: {
    color: "#222",
    fontSize: 14,
    fontFamily: "SourGummy_400Regular",
  },
  timestamp: {
    fontSize: 10,
    color: "#555",
    marginTop: 3,
    alignSelf: "flex-end",
    fontFamily: "SourGummy_400Regular",
  },
  audioContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  audioText: {
    color: "#e91e63",
    fontWeight: "600",
  },
  imageMessage: {
    width: 150,
    height: 150,
    borderRadius: 15,
  },
   inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: "transparent",
  },

  cameraButton: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "#f7f7f7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  inputWrapper: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  textInput: {
    flex: 1,
    height: 40,
    color: "black",
    fontSize: 14,
    fontFamily: "SourGummy_400Regular",
  },

  micIcon: {
    paddingLeft: 10,
  },

  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f7f7f7",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    borderColor: "#ccc",
    borderWidth: 1,
  },
});
