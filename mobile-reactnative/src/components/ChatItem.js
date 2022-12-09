import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { useConversationContext } from "../store/contexts/ConversationContext";
import { useGlobalContext } from "../store/contexts/GlobalContext";
import { converDate } from "../utils";

const ChatItem = ({ conver, navigation }) => {
  const { name, lastMessageId, _id, type, avatar, members } = conver;
  const { lastViews, getMember } = useConversationContext();
  const { user } = useGlobalContext();
  const [lastView, setLastView] = useState();

  function onPressItem() {
    navigation.navigate("ChatRoom", {
      converId: _id,
      name: getNameOfSimpleConver(),
    });
  }

  // get name of simple conver
  function getNameOfSimpleConver() {
    for (let i = 0; i < conver.members.length; i++) {
      if (conver.members[i]._id != user._id) {
        return conver.members[i].name;
      }
    }
  }

  function renderLastMessage() {
    if (lastMessageId) {
      if (lastMessageId.type == "TEXT" || lastMessageId.type == "NOTIFY") {
        return lastMessageId.content;
      } else if (
        lastMessageId.type == "FILE" ||
        lastMessageId.type == "IMAGE"
      ) {
        return `[${lastMessageId.type}] ${lastMessageId.content}`;
      }
    }
  }

  function countMessagesUnseen() {
    let _messages = [...conver.messages];
    let _lastView = getlastViewsByConverId(_id);
    if (!_lastView) return 0;
    let count = 0;
    let dateLastView = new Date(_lastView.lastView);

    _messages.forEach((mess) => {
      let d1 = new Date(mess.createdAt);
      if (d1 > dateLastView) {
        count++;
      }
    });
    return count;
  }

  function getlastViewsByConverId(converId) {
    for (let i = 0; i < lastViews.length; i++) {
      if (converId == lastViews[i].conversationId) {
        return lastViews[i];
      }
    }
  }

  function renderNumOfMessagesUnSeen() {
    let count = countMessagesUnseen();
    if (count == 0) return null;
    if (count > 5)
      return (
        <Text numberOfLine={1} style={styles.numberOfNewMessage}>
          {"5+"}
        </Text>
      );
    return (
      <Text numberOfLine={1} style={styles.numberOfNewMessage}>
        {count}
      </Text>
    );
  }

  function renderTime() {
    let nowDate = converDate(new Date());
    let date = converDate(lastMessageId && lastMessageId.createdAt);

    if (
      nowDate.year == date.year &&
      nowDate.month == date.month &&
      nowDate.date == date.date &&
      nowDate.hour == date.hour &&
      nowDate.min == date.min
    ) {
      return nowDate.sec - date.sec + " giây trước";
    }

    if (
      nowDate.year == date.year &&
      nowDate.month == date.month &&
      nowDate.date == date.date &&
      nowDate.hour == date.hour
    ) {
      return nowDate.min - date.min + " phút trước";
    }

    if (
      nowDate.year == date.year &&
      nowDate.month == date.month &&
      nowDate.date == date.date
    ) {
      return nowDate.hour - date.hour + " giờ trước";
    }
    if (nowDate.year == date.year && nowDate.month == date.month) {
      return nowDate.date - date.date + " ngày trước";
    }

    return date.toStringDMY;
  }

  // render avatar
  function renderAvatar() {
    if (type) {
      return (
        <View style={styles.imageContainer}>
          {avatar ? (
            <Image
              source={{
                uri: avatar,
              }}
              style={styles.avatar}
            />
          ) : (
            <Image
              source={require("../../assets/groupAvatar.png")}
              style={styles.avatar}
            />
          )}
        </View>
      );
    } else {
      let member;
      members.forEach((item) => {
        if (item._id != user._id) {
          member = item;
        }
      });
      if (member) {
        return (
          <View style={styles.imageContainer}>
            {member.avatar ? (
              <Image
                source={{
                  uri: member.avatar,
                }}
                style={styles.avatar}
              />
            ) : (
              <Image
                source={require("../../assets/avatar.jpg")}
                style={styles.avatar}
              />
            )}
          </View>
        );
      } else {
        return (
          <View style={styles.imageContainer}>
            <Image
              source={require("../../assets/avatar.jpg")}
              style={styles.avatar}
            />
          </View>
        );
      }
    }
  }

  return (
    <View style={styles.wrap}>
      <TouchableOpacity
        onPress={() => onPressItem()}
        activeOpacity={0.9}
        style={styles.container}
      >
        {renderAvatar()}
        <View style={styles.centerContainer}>
          <Text
            style={[
              styles.name,
              countMessagesUnseen() > 0 && styles.nameRoomUnMessages,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {type ? name : getNameOfSimpleConver()}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              styles.lastMessage,
              countMessagesUnseen() > 0 && styles.lastMessageUnSeen,
            ]}
          >
            {renderLastMessage()}
          </Text>
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.lastTime}>{renderTime()}</Text>
          {renderNumOfMessagesUnSeen()}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  container: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    paddingRight: 12,
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
  },
  nameRoomUnMessages: {
    fontWeight: "bold",
  },
  lastMessage: {
    paddingTop: 4,
    fontSize: 14,
    color: "#858383",
  },
  lastMessageUnSeen: {
    color: "black",
  },
  rightContainer: {
    justifyContent: "center",
  },
  lastTime: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#858383",
  },
  numberOfNewMessage: {
    backgroundColor: "red",
    textAlign: "center",
    fontSize: 10,
    color: "white",
    fontWeight: "bold",
    marginTop: 4,
    borderRadius: 50,
    lineHeight: 20,
    width: 20,
    height: 20,
    marginLeft: "auto",
  },
});

export default ChatItem;
