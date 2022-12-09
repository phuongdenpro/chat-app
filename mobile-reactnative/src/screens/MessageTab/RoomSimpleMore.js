import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useConversationContext } from "../../store/contexts/ConversationContext";
import userApi from "../../api/userApi";
import { useGlobalContext } from "../../store/contexts/GlobalContext";

const RoomSimpleMore = (props) => {
  const { getConverById, convers, deleteHistoryMessages } =
    useConversationContext();
  const { user, setModalProfile } = useGlobalContext();
  const { route } = props;
  const { converId } = route.params;
  const [conver, setConver] = useState(getConverById(converId));
  const [member, setMember] = useState();
  const [isNotify, setisNotify] = useState(false);

  useEffect(() => {
    if (converId) {
      setConver(getConverById(converId));
      loadMember();
    }
    return () => {};
  }, [converId, convers]);

  if (!conver) return null;

  function loadMember() {
    if (conver) {
      let member;
      conver.members.forEach((item) => {
        if (item._id != user._id) {
          member = item;
        }
      });
      if (member) {
        setMember(member);
      }
    }
  }

  async function onDetailProfilePress() {
    console.log("show");

    let acc = await userApi.findUserById(member._id);
    if (acc.isSuccess) {
      setModalProfile({
        acc: acc,
        isShow: true,
      });
    }
  }

  // xóa lịch sử
  async function onDeleteHistoryMessages() {
    let is = await deleteHistoryMessages(converId);
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {member && member.avatar ? (
          <Image source={{ uri: member.avatar }} style={styles.image} />
        ) : (
          <Image
            source={require("../../../assets/avatar.jpg")}
            style={styles.image}
          />
        )}
      </View>
      <Text style={styles.name}>{member && member.name}</Text>
      <View style={styles.sections}>
        <View style={styles.section}>
          <View style={styles.sectionIcon}>
            <Ionicons name="person-outline" size={20} color="black" />
          </View>
          <Text style={styles.label} onPress={onDetailProfilePress}>
            Trang cá nhân
          </Text>
        </View>
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
      <Pressable onPress={onDeleteHistoryMessages} style={styles.body}>
        <View style={styles.item}>
          <Feather name="trash-2" size={24} color="red" />
          <Text style={[styles.text, styles.removeText]}>
            Xóa lịch sử trò chuyện
          </Text>
        </View>
      </Pressable>
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
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    paddingBottom: 12,
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

export default RoomSimpleMore;
