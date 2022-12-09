import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Image,
  SafeAreaView,
  SafeAreaViewBase,
  SafeAreaViewComponent,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";
import FriendsModal from "./FriendsModal";
import FriendsBody from "./components/FriendsBody";
import GroupChatBody from "./components/GroupChatBody";

const Stack = createStackNavigator();

const Friends = (props) => {
  const { navigation, route } = props;
  const [isModalShow, setIsModalShow] = useState(false);
  const [activeTab, setactiveTab] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text
          onPress={() => setactiveTab(true)}
          style={[styles.navItem, activeTab && styles.navItemAcctive]}
        >
          BẠN BÈ
        </Text>
        <Text
          onPress={() => setactiveTab(false)}
          style={[styles.navItem, !activeTab && styles.navItemAcctive]}
        >
          NHÓM
        </Text>
      </View>

      {!activeTab ? (
        <GroupChatBody navigation={navigation} />
      ) : (
        <FriendsBody navigation={navigation} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  navItem: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    paddingVertical: 8,
    color: "#ccc",
  },
  navItemAcctive: {
    borderBottomWidth: 4,
    borderBottomColor: "blue",
    color: "black",
  },
});

export default Friends;
