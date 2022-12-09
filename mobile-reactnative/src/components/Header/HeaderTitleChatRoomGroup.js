import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
} from "react-native";

import { EvilIcons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";

const HeaderTitleChatRoomGroup = (props) => {
  const { numOfMember, navigation, conver } = props;

  function onNamePress() {
    navigation.navigate("RoomChatGroupMore", {
      converId: conver._id,
    });
  }

  function onAddMemberPress() {
    navigation.navigate("ListMember", {
      converId: conver._id,
    });
  }

  function onListPress() {
    navigation.navigate("RoomChatGroupMore", { converId: conver._id });
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.itemGroup} onPress={onNamePress}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {conver.name}
        </Text>
        <Text style={styles.quantity}>{numOfMember} thành viên</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.itemIcon} onPress={onAddMemberPress}>
        <MaterialCommunityIcons
          name="account-multiple-plus-outline"
          size={26}
          color="white"
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.itemIcon} onPress={onListPress}>
        <Feather name="list" size={26} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  itemGroup: {
    flex: 1,
  },
  name: {
    color: "white",
    fontWeight: "bold",
    paddingRight: 6,
  },
  quantity: {
    color: "#ccc",
    fontSize: 10,
  },
  itemIcon: {
    paddingLeft: 16,
    paddingVertical: 8,
  },
});

export default HeaderTitleChatRoomGroup;
