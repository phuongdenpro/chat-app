import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Ionicons,
  Feather,
  AntDesign,
  SimpleLineIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useConversationContext } from "../../store/contexts/ConversationContext";
import { useGlobalContext } from "../../store/contexts/GlobalContext";

const RoomChatGroupMore = (props) => {
  const { user } = useGlobalContext();
  const {
    leaveGroup,
    renameConver,
    updateAvatar,
    getConverById,
    convers,
    deleteHistoryMessages,
    deleteGroupByLeader,
  } = useConversationContext();
  const { route, navigation } = props;
  const { converId } = route.params;
  const [conver, setConver] = useState(getConverById(converId));
  const [isNotify, setisNotify] = useState(false);
  const [isEditName, setisEditName] = useState(false);
  const [nameInput, setnameInput] = useState(conver.name);
  const [image, setImage] = useState(null);
  const [name, setName] = useState(conver.name);

  // useEffect
  useEffect(() => {
    console.log("convers change");

    let _conv = getConverById(converId);
    if (_conv) {
      setConver(_conv);
    } else {
      navigation.navigate("ListChat");
    }
    return () => {};
  }, [convers]);

  async function onPickImage() {
    console.log("pick");
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result);

      updateAvatar(conver._id, result);
    }
  }

  async function onLeaveGroup() {
    const is = await leaveGroup(conver._id);
  }

  async function onDeleteGroupByLeader() {
    let is = await deleteGroupByLeader(conver._id);
  }

  async function onRenameConver() {
    setisEditName(false);
    setName(nameInput);
    if (nameInput) {
      const is = await renameConver(conver._id, nameInput);
    }
  }

  function onMemberList() {
    navigation.navigate("ListMember", { converId });
  }

  function renderAvatar() {
    if (image) {
      return <Image source={{ uri: image.uri }} style={styles.avatar} />;
    }

    if (conver.avatar) {
      return <Image source={{ uri: conver.avatar }} style={styles.avatar} />;
    }

    return (
      <Image
        source={require("../../../assets/groupAvatar.png")}
        style={styles.avatar}
      />
    );
  }

  async function onDeleteHistoryMessages() {
    let is = await deleteHistoryMessages(converId);
  }
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatarWrap}>
          {renderAvatar()}
          <Ionicons
            style={styles.iconCamera}
            name="camera-outline"
            size={24}
            color="black"
            onPress={onPickImage}
          />
        </View>
      </View>
      <View style={styles.nameContainer}>
        {!isEditName ? (
          <>
            <Text style={styles.name}>{name}</Text>
            <FontAwesome5
              name="pencil-alt"
              style={styles.penIcon}
              size={18}
              color="black"
              onPress={() => {
                setisEditName(true);
              }}
            />
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              value={nameInput}
              onChangeText={setnameInput}
            />
            <Text onPress={onRenameConver} style={styles.btnSaveName}>
              Lưu
            </Text>
          </>
        )}
      </View>
      <View style={styles.sections}>
        <Pressable style={styles.section} onPress={onMemberList}>
          <View style={styles.sectionIcon}>
            <Ionicons name="ios-person-add-outline" size={20} color="black" />
          </View>
          <Text style={styles.label}>Thêm thành viên</Text>
        </Pressable>
        <Pressable
          onPress={() => setisNotify(!isNotify)}
          style={styles.section}
        >
          {!isNotify ? (
            <>
              <View style={styles.sectionIcon}>
                <Ionicons
                  name="notifications-off-outline"
                  size={20}
                  color="black"
                />
              </View>
              <Text style={styles.label}>Bật thông báo</Text>
            </>
          ) : (
            <>
              <View style={styles.sectionIcon}>
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color="black"
                />
              </View>
              <Text style={styles.label}>Tắt thông báo</Text>
            </>
          )}
        </Pressable>
      </View>

      <View style={styles.body}>
        <TouchableOpacity style={styles.item} onPress={onMemberList}>
          <Ionicons name="md-people-outline" size={24} color="black" />
          <Text style={styles.text}>
            Xem thành viên ({conver.members.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <AntDesign name="pushpino" size={24} color="black" />
          <Text style={styles.text}>
            Tin nhắn đã gim ({conver && conver.pinMessageIds.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={onDeleteHistoryMessages}>
          <Feather name="trash-2" size={24} color="red" />
          <Text style={[styles.text, styles.removeText]}>
            Xóa lịch sử trò chuyện
          </Text>
        </TouchableOpacity>
        {conver.leaderId != user._id ? (
          <TouchableOpacity style={styles.item} onPress={onLeaveGroup}>
            <SimpleLineIcons name="logout" size={24} color="red" />
            <Text style={[styles.text, styles.removeText]}>Rời nhóm</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.item} onPress={onDeleteGroupByLeader}>
            <SimpleLineIcons name="logout" size={24} color="red" />
            <Text style={[styles.text, styles.removeText]}>Xóa nhóm</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  avatarWrap: {
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  iconCamera: {
    position: "absolute",
    bottom: 2,
    right: -4,
    padding: 4,
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 12,
  },
  name: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  penIcon: {
    paddingHorizontal: 12,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    minWidth: 250,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  btnSaveName: {
    marginLeft: 12,
    backgroundColor: "#1a69d9",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    color: "white",
  },
  sections: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 12,
  },

  section: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  sectionIcon: {
    height: 32,
    width: 32,
    borderRadius: 50,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
  },
  body: {
    borderTopColor: "#eee",
    borderTopWidth: 8,
  },
  item: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
  },
  text: {
    marginLeft: 12,
  },
  removeText: {
    color: "red",
  },
});

export default RoomChatGroupMore;
