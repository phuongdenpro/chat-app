import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { FontAwesome, Ionicons, Entypo } from "@expo/vector-icons";
import { useFriendContext } from "../../../store/contexts/FriendContext";
import { useConversationContext } from "../../../store/contexts/ConversationContext";
import { useGlobalContext } from "../../../store/contexts/GlobalContext";
import userApi from "../../../api/userApi";
const AddFriendItem = (props) => {
  const { getConverById, leaveGroup, deleteMember, addManager, deleteManager } =
    useConversationContext();
  const { user, modalProfile, setModalProfile } = useGlobalContext();
  const {
    checkIsMyFriend,
    sendRequestFriend,
    checkIsRequested,
    deleteRequestFriend,
  } = useFriendContext();
  const { avatar, name, _id, converId, selectedId, setSelectedId } = props;

  const conver = converId && getConverById(converId);

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

    if (_id == user._id) {
      return null;
    }

    return (
      <TouchableOpacity onPress={onRequestFriend} style={styles.btnContainer}>
        <FontAwesome name="user-plus" size={18} color="#1a69d9" />
      </TouchableOpacity>
    );
  }

  // kiểm tra xem có phải trưởng nhóm hay phó nhóm không
  function renderPosition(_id) {
    if (conver) {
      if (_id == conver.leaderId) {
        return "Người tạo nhóm";
      }
      if (conver.managerIds.includes(_id)) {
        return "Trưởng nhóm";
      }
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

  async function onLeaveGroup() {
    setSelectedId(null);
    const is = await leaveGroup(conver._id);
  }

  async function onKickOutGroup() {
    setSelectedId(null);
    const is = await deleteMember(conver._id, _id);
  }
  async function onDeleteManager() {
    setSelectedId(null);
    const is = await deleteManager(conver._id, _id);
  }
  async function onAddManager() {
    setSelectedId(null);
    const is = await addManager(conver._id, _id);
  }

  function renderOptionsWhenClickThreeDots() {
    if (selectedId && selectedId == _id) {
      return (
        <View style={styles.options}>
          {user._id == _id ? (
            <>
              {user._id != conver.leaderId && (
                <TouchableOpacity
                  style={styles.textOption}
                  onPress={onLeaveGroup}
                >
                  <Text>Rời nhóm</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.textOption}
                onPress={onKickOutGroup}
              >
                <Text>Đuổi khỏi nhóm</Text>
              </TouchableOpacity>
              {conver.managerIds.includes(_id) ? (
                <TouchableOpacity
                  style={styles.textOption}
                  onPress={onDeleteManager}
                >
                  <Text>Xóa trưởng nhóm</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.textOption}
                  onPress={onAddManager}
                >
                  <Text>Làm trưởng nhóm</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      );
    }
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
        <Text style={styles.desc}>{conver && renderPosition(_id)}</Text>
      </View>
      <View style={styles.right}>
        {renderRight()}
        {/* render when show member of conversation */}
        {((conver &&
          (user._id == conver.leaderId ||
            conver.managerIds.includes(user._id))) ||
          user._id == _id) && (
          <>
            <Entypo
              style={styles.dots}
              name="dots-three-horizontal"
              size={24}
              color="black"
              onPress={() => setSelectedId(_id)}
            />
            {/* View when click three dots */}
            {renderOptionsWhenClickThreeDots()}
          </>
        )}
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
    position: "relative",
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
  desc: {
    fontSize: 14,
    color: "#555",
  },
  right: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnContainer: {
    padding: 12,
  },
  btnCancel: {
    backgroundColor: "#ddd",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
  },
  dots: {
    paddingLeft: 4,
  },
  options: {
    position: "absolute",
    backgroundColor: "#ddd",
    borderRadius: 4,
    right: 26,
    minHeight: 46,
    justifyContent: "center",
  },
  textOption: {
    paddingVertical: 4,
    fontSize: 13,
    paddingHorizontal: 8,
  },
});

export default AddFriendItem;
