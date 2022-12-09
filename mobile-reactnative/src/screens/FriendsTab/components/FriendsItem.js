import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import friendApi from "../../../api/friendApi";
import { useFriendContext } from "../../../store/contexts/FriendContext";
import { useConversationContext } from "../../../store/contexts/ConversationContext";
import { useGlobalContext } from "../../../store/contexts/GlobalContext";
import userApi from "../../../api/userApi";

const FriendsItem = (props) => {
  const {
    _id,
    avatar,
    name,
    navigation,
    idOptionShow,
    setIdOptionShow,
    index,
    length,
    isOnline,
  } = props;
  console.log(isOnline);
  const { createSimpleConver } = useConversationContext();

  const { modalProfile, setModalProfile } = useGlobalContext();

  const { deleteFriend } = useFriendContext();

  async function onGoToConver() {
    setIdOptionShow(null);
    const converId = await createSimpleConver(_id);
    if (converId) {
      console.log("goto conver");
      navigation.navigate("MessageTab", {
        screen: "ListChat",
        params: {
          screen: "ChatRoom",
          params: {
            converId,
          },
        },
      });
    }
  }

  async function onRemoveFriend() {
    setIdOptionShow(null);
    const is = await deleteFriend(_id);
    if (is) {
      console.log("delete friend ok");
    }
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
    <Pressable
      onPress={onShowProfile}
      style={[styles.item, index == length - 1 && { marginTop: 24 }]}
    >
      <View style={styles.avatarContainer}>
        {avatar ? (
          <Image
            source={{
              uri: avatar,
            }}
            style={styles.avatar}
          />
        ) : (
          <Image
            source={require("../../../../assets/avatar.jpg")}
            style={styles.avatar}
          />
        )}

        {isOnline && <View style={styles.onlineIcon}></View>}
      </View>
      <View style={styles.body}>
        <Text style={styles.name}>{name}</Text>
        {isOnline && <Text style={styles.des}>Dang online</Text>}
      </View>
      <View style={styles.icon}>
        {/* <Ionicons
          name="chatbox-ellipses-outline"
          size={24}
          color="black"
          onPress={() => {
            console.log("go to conver");
          }}
        /> */}
        <Entypo
          name="dots-three-horizontal"
          size={20}
          color="#aaa"
          onPress={() => setIdOptionShow(_id)}
        />
      </View>
      {idOptionShow == _id && (
        <View
          style={[
            styles.options,
            index == 0 && { top: 0 },
            index == length - 1 && { top: -24 },
          ]}
        >
          <TouchableOpacity style={styles.option} onPress={onGoToConver}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={18}
              color="black"
            />
            <Text style={styles.optionText}>Nhắn tin</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={onRemoveFriend}>
            <Ionicons
              name="ios-person-remove-outline"
              size={18}
              color="black"
            />
            <Text style={styles.optionText}>Xóa bạn</Text>
          </TouchableOpacity>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    position: "relative",
    overflow: "visible",
  },
  avatarContainer: {
    paddingRight: 12,
    position: "relative",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  onlineIcon: {
    width: 15,
    height: 15,
    borderRadius: 50,
    backgroundColor: "#42f569",
    position: "absolute",
    right: 10,
    top: -4,
  },
  body: {
    flex: 1,
  },
  name: {
    fontSize: 16,
  },
  des: {
    paddingTop: 2,
    fontSize: 12,
    color: "#42f569",
  },
  icon: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },

  options: {
    position: "absolute",
    right: 0,
    backgroundColor: "#cccccc",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 100,
  },
  option: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  optionText: {
    fontSize: 12,
    paddingLeft: 6,
  },
});

export default FriendsItem;
