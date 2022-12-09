import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import userApi from "../../api/userApi";
import { useConversationContext } from "../../store/contexts/ConversationContext";
import { useGlobalContext } from "../../store/contexts/GlobalContext";

const NotifyMessage = ({ item }) => {
  const { modalProfile, setModalProfile } = useGlobalContext();
  const [sender, setSender] = useState(item.senderId);

  function renderText() {
    if (item.content == "Đã thêm vào nhóm") {
      if (item.manipulatedUserIds) {
        return (
          <>
            <Text
              style={styles.name}
              onPress={() => {
                setModalProfile({
                  isShow: true,
                  acc: sender,
                });
              }}
            >
              {sender && sender.name}
            </Text>
            <Text
              style={styles.text}
            >{`Đã thêm ${item.manipulatedUserIds.length} người vào nhóm`}</Text>
          </>
        );
      }
    }

    return (
      <>
        <Text
          style={styles.name}
          onPress={() => {
            console.warn("go to profile");
          }}
        >
          {sender && sender.name}
        </Text>
        <Text style={styles.text}>{item.content}</Text>
      </>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.body}>{renderText()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    paddingHorizontal: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    padding: 4,
    fontWeight: "bold",
    color: "#2c5c8b",
  },
  text: {
    color: "black",
  },
});

export default NotifyMessage;
