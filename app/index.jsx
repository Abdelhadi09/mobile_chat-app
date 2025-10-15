import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import ChatList from "./ChatList";
import ChatScreen from "./ChatScreen";
import { StackScreen } from "react-native-screens";
import { useFonts, SourGummy_400Regular, SourGummy_600SemiBold } from "@expo-google-fonts/sour-gummy";
import { AuthProvider } from "../contexts/AuthContext";

const Stack = createNativeStackNavigator();

export default function App() {
    const [fontsLoaded] = useFonts({
    SourGummy_400Regular,
    SourGummy_600SemiBold,
  });
  return (
   <AuthProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ChatList" component={ChatList} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </AuthProvider>
  );
}
