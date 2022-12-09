import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { View, StyleSheet } from "react-native";
import MyProfile from "./MyProfile";

const Stack = createStackNavigator();

const MyProfileTab = () => {
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
      <Stack.Screen
        name="MyProfile"
        component={MyProfile}
        options={{
          title: "Thông tin của tôi",
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default MyProfileTab;
