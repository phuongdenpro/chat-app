import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useFriendContext } from "../../../store/contexts/FriendContext";
import userApi from "../../../api/userApi";
import { useGlobalContext } from "../../../store/contexts/GlobalContext";
const FriendRequestSendItem = (props) => {
  const { avatar, name, _id } = props;
  const { modalProfile, setModalProfile } = useGlobalContext();
  const {
    checkIsMyFriend,
    sendRequestFriend,
    checkIsRequested,
    deleteRequestFriend,
  } = useFriendContext();

  async function onRequestFriend() {
    const is = await sendRequestFriend(_id);
    if (is) {
      console.log("send request ok");
    }
  }
  async function cancelRequest() {
    const is = await deleteRequestFriend(_id);
    if (is) {
      console.log("delete request ok");
    }
  }

  function renderRight() {
    if (checkIsMyFriend(_id)) {
      return (
        <View style={styles.aaaa}>
          <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
        </View>
      );
    }
    if (checkIsRequested(_id)) {
      return (
        <Text onPress={cancelRequest} style={styles.btnCancel}>
          {" "}
          Thu hồi
        </Text>
      );
    }

    return (
      <TouchableOpacity onPress={onRequestFriend} style={styles.btnContainer}>
        <FontAwesome name="user-plus" size={18} color="#1a69d9" />
      </TouchableOpacity>
    );
  }
  async function onShowProfile() {
    try {
      let acc = await userApi.findUserById(_id);
      setModalProfile({
        isShow: true,
        acc,
      });
    } catch (error) {}
  }

  return (
    <Pressable style={styles.container} onPress={onShowProfile}>
      <View style={styles.avatarContainer}>
        {avatar ? (
          <Image
            source={{
              uri: avatar,
            }}
            style={styles.avatar}
          ></Image>
        ) : (
          <Image
            source={require("../../../../assets/avatar.jpg")}
            style={styles.avatar}
          ></Image>
        )}
      </View>
      <View style={styles.middle}>
        <Text style={styles.name}>{name}</Text>
      </View>
      <View style={styles.right}>{renderRight()}</View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
    backgroundColor: "white",
  },
  avatarContainer: {},
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  middle: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
  },
  right: {},
  btnContainer: {
    padding: 12,
  },
  btnCancel: {
    backgroundColor: "#ddd",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
  },
});

export default FriendRequestSendItem;
