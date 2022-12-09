import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import HeaderTitleMessage from "../../components/Header/HeaderTitleMessage";
import { useConversationContext } from "../../store/contexts/ConversationContext";
import ChatRoom from "./ChatRoom";
import ListChat from "./ListChat";
import RoomSimpleMore from "./RoomSimpleMore";
import RoomChatGroupMore from "./RoomChatGroupMore";
import ListMember from "./ListMember";

const Stack = createStackNavigator();

const MessageTabScreen = (props) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1a69d9",
        },
        headerTintColor: "white",
        headerTitleStyle: {
          fontSize: 16,
        },
      }}
    >
      <Stack.Screen name="ListChat" component={ListChat} />
      <Stack.Screen name="ChatRoom" component={ChatRoom} />
      <Stack.Screen
        name="RoomSimpleMore"
        component={RoomSimpleMore}
        options={{
          title: "Tùy chọn",
        }}
      />

      <Stack.Screen
        name="RoomChatGroupMore"
        component={RoomChatGroupMore}
        options={{
          title: "Tùy chọn",
        }}
      />

      <Stack.Screen
        name="ListMember"
        component={ListMember}
        options={{
          title: "Tùy chọn",
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default MessageTabScreen;
