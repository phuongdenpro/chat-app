import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { View, StyleSheet } from "react-native";
import AddFriend from "./AddFriend";
import AddGroupChat from "./AddGroupChat";
import FriendRequest from "./FriendRequest";
import Friends from "./Friends";

const Stack = createStackNavigator();

const FriendsTab = ({ navigation }) => {
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
      initialRouteName={"Friends"}
    >
      <Stack.Screen
        name="Friends"
        component={Friends}
        options={{
          title: "Danh sách",

          headerTitleAlign: "center",
        }}
      />

      <Stack.Screen
        name="AddFriend"
        component={AddFriend}
        options={{
          title: "Thêm mới bạn bè",
        }}
      />

      <Stack.Screen
        name="FriendRequest"
        component={FriendRequest}
        options={{
          title: "Lời mời kết bạn",
        }}
      />
      <Stack.Screen
        name="AddGroupChat"
        component={AddGroupChat}
        options={{
          title: "Nhóm mới",
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default FriendsTab;
