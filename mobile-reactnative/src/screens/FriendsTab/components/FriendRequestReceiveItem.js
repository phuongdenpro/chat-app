import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { converDate } from "../../../utils";
import friendApi from "../../../api/friendApi";
import { useFriendContext } from "../../../store/contexts/FriendContext";
import userApi from "../../../api/userApi";
import { useGlobalContext } from "../../../store/contexts/GlobalContext";

const FriendRequestReceiveItem = (props) => {
  const { senderId, updatedAt } = props;
  console.log(senderId);

  const { acceptFriend, refuseFriend } = useFriendContext();
  const { modalProfile, setModalProfile } = useGlobalContext();

  let date = converDate(updatedAt);

  async function onAccept() {
    console.log("accept");
    const is = await acceptFriend(senderId._id);
    if (is) {
      console.log("ok:");
    } else {
      console.log("faild:");
    }
  }

  async function onRefuse() {
    let is = await refuseFriend(senderId._id);
  }

  async function onShowProfile() {
    try {
      let acc = await userApi.findUserById(senderId._id);
      setModalProfile({
        isShow: true,
        acc,
      });
    } catch (error) {}
  }

  return (
    <Pressable style={styles.container} onPress={onShowProfile}>
      <View style={styles.avatarContainer}>
        <Image
          source={require("../../../../assets/avatar.jpg")}
          style={styles.avatar}
        ></Image>
      </View>
      <View style={styles.middle}>
        <Text style={styles.name}>{senderId.name}</Text>
        <Text style={styles.time}>Ngày {date.toStringDMY}</Text>
      </View>
      <View style={styles.right}>
        <Text onPress={onRefuse} style={styles.btn}>
          Từ chối
        </Text>
        <Text onPress={onAccept} style={[styles.btn, styles.btnAccept]}>
          Đồng ý
        </Text>
      </View>
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
    fontWeight: "bold",
  },
  time: {
    fontSize: 14,
  },
  right: {
    flexDirection: "row",
  },
  btnContainer: {
    padding: 12,
  },
  btn: {
    backgroundColor: "#ddd",
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 13,
    borderRadius: 18,
    marginLeft: 4,
  },
  btnAccept: {
    color: "#1a69d9",
  },
});

export default FriendRequestReceiveItem;
