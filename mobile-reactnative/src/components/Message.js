import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import ImageMessage from "./MessageType/ImageMessage";
import TextMessage from "./MessageType/TextMessage";
import {
  Foundation,
  Fontisto,
  SimpleLineIcons,
  FontAwesome,
  Feather,
  AntDesign,
} from "@expo/vector-icons";
import NotifyMessage from "./MessageType/NotifyMessage";
import DeletedMessage from "./MessageType/DeletedMessage";
import FileMessage from "./MessageType/FileMessage";

const Message = (props) => {
  let {
    style,
    item,
    isMyMessage,
    isRenderAvatarIcon,
    index,
    sender,
    idSelected,
    setIdSelected,
    showModalReact,
  } = props;
  let { type, senderId, isDeleted } = item;

  function renderMessageContent() {
    if (isDeleted) {
      return <DeletedMessage isMyMessage={isMyMessage} />;
    }

    // console.log(type);
    if (type === "TEXT") {
      return (
        <TextMessage
          item={item}
          isMyMessage={isMyMessage}
          sender={sender}
          idSelected={idSelected}
          setIdSelected={setIdSelected}
          showModalReact={showModalReact}
        />
      );
    } else if (type === "NOTIFY") {
      return <NotifyMessage item={item} isMyMessage={isMyMessage} />;
    } else if (type === "IMAGE") {
      return <ImageMessage item={item} showModalReact={showModalReact} />;
    } else if (type == "FILE") {
      return (
        <FileMessage
          item={item}
          isMyMessage={isMyMessage}
          showModalReact={showModalReact}
        />
      );
    }
  }

  function deletedWithMy() {}

  function isRenderAvatar() {
    if (type === "NOTIFY" || type === "VOTE") return false;
    if (isMyMessage) return false;
    return isRenderAvatarIcon(senderId._id, index);
  }

  function renderAvatar(senderId) {
    if (senderId && senderId.avatar) {
      return (
        <Image style={styles.image} source={{ uri: senderId.avatar }}></Image>
      );
    } else {
      return (
        <Image
          style={styles.image}
          source={require("../../assets/avatar.jpg")}
        ></Image>
      );
    }
  }

  return (
    <Pressable style={[style, styles.wrapper]}>
      <View style={styles.imageContainer}>
        {isRenderAvatar() && renderAvatar(senderId)}
      </View>
      <TouchableOpacity style={styles.container} activeOpacity={1}>
        {renderMessageContent()}
      </TouchableOpacity>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    flex: 1,
    marginVertical: 8,
    position: "relative",
  },
  container: {
    flexDirection: "row",
    flex: 1,
  },
  imageContainer: {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginRight: 12,
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginRight: 12,
  },
  body: {
    marginRight: "25%",
    borderRadius: 10,
  },
});

export default Message;
