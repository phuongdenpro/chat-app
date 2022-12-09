import React from "react";
import {
  View,
  StyleSheet,
  Modal,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { converDate } from "../utils";
import { useGlobalContext } from "../store/contexts/GlobalContext";
import { useConversationContext } from "../store/contexts/ConversationContext";
import { reactListStyles } from "./MessageType/TextMessage";

const ReactModal = ({
  isShowModal,
  setIsShowModal,
  message,
  typeOfConversation,
}) => {
  const { user } = useGlobalContext();
  const { addReaction, recallMessage, recallMessageOnly, pinMessage } =
    useConversationContext();
  if (message == null || !isShowModal) return null;
  let isMyMessage = user._id == message.senderId._id;

  function onAddReaction(messageId, type) {
    setIsShowModal(false);
    addReaction(messageId, type);
  }

  function renderReactList(reacts) {
    if (!reacts || (reacts && reacts.length == 0)) return null;
    let typeCheck = {};
    reacts.forEach((item) => {
      typeCheck[item.type] = true;
    });

    return (
      <View
        style={[
          reactListStyles.reactList,
          isMyMessage && reactListStyles.reactListOfMyMessage,
        ]}
      >
        <View style={reactListStyles.reactItem}>
          <Text style={reactListStyles.reactItemCount}>{reacts.length}</Text>
        </View>
        {typeCheck["1"] && (
          <TouchableOpacity style={reactListStyles.reactItem}>
            <Image
              source={require("../../assets/like.png")}
              style={reactListStyles.reactIcon}
            />
          </TouchableOpacity>
        )}

        {typeCheck["2"] && (
          <TouchableOpacity style={reactListStyles.reactItem}>
            <Image
              source={require("../../assets/love.png")}
              style={reactListStyles.reactIcon}
            />
          </TouchableOpacity>
        )}
        {typeCheck["3"] && (
          <TouchableOpacity style={reactListStyles.reactItem}>
            <Image
              source={require("../../assets/haha.png")}
              style={reactListStyles.reactIcon}
            />
          </TouchableOpacity>
        )}
        {typeCheck["4"] && (
          <TouchableOpacity style={reactListStyles.reactItem}>
            <Image
              source={require("../../assets/wow.png")}
              style={reactListStyles.reactIcon}
            />
          </TouchableOpacity>
        )}
        {typeCheck["5"] && (
          <TouchableOpacity style={reactListStyles.reactItem}>
            <Image
              source={require("../../assets/sad.png")}
              style={reactListStyles.reactIcon}
            />
          </TouchableOpacity>
        )}
        {typeCheck["6"] && (
          <TouchableOpacity style={reactListStyles.reactItem}>
            <Image
              source={require("../../assets/angry.png")}
              style={reactListStyles.reactIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  function renderFileName(content) {
    let newName = content.replace(
      /https:\/\/upload-gavroche-chat-app\.s3\.ap-southeast-1\.amazonaws.com\/gavroche-[0-9]*-/g,
      ""
    );
    return newName;
  }

  return (
    <Modal visible={isShowModal} transparent={true}>
      <Pressable onPress={() => setIsShowModal(false)} style={styles.container}>
        <Pressable style={styles.body}>
          <View style={{ flexDirection: "row", width: "100%" }}>
            {!isMyMessage && (
              <View style={styles.avatar}>
                {message.senderId.avatar ? (
                  <Image
                    source={{ uri: message.senderId.avatar }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Image
                    source={require("../../assets/avatar.jpg")}
                    style={styles.avatarImage}
                  />
                )}
              </View>
            )}
            <View style={[styles.message, isMyMessage && styles.myMessage]}>
              {!isMyMessage && (
                <Text style={styles.senderName}>{message.senderId.name}</Text>
              )}
              {message.type == "TEXT" && (
                <Text style={styles.content}>{message.content}</Text>
              )}

              {message.type == "IMAGE" && (
                <Image
                  source={{ uri: message.content }}
                  style={styles.imageContent}
                />
              )}
              {message.type == "FILE" && (
                <View style={styles.file}>
                  <Feather name="file-text" size={24} color="black" />
                  <Text style={styles.link}>
                    {renderFileName(message && message.content)}
                  </Text>
                </View>
              )}

              <Text style={styles.time}>
                {converDate(message.createdAt).toString}
              </Text>
              {renderReactList(message.reacts)}
            </View>
          </View>

          <View style={styles.reactList}>
            <TouchableOpacity
              style={styles.reactItem}
              onPress={() => onAddReaction(message._id, 1)}
            >
              <Image
                source={require("../../assets/like.png")}
                style={styles.reactIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.reactItem}
              onPress={() => onAddReaction(message._id, 2)}
            >
              <Image
                source={require("../../assets/love.png")}
                style={styles.reactIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.reactItem}
              onPress={() => onAddReaction(message._id, 3)}
            >
              <Image
                source={require("../../assets/haha.png")}
                style={styles.reactIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.reactItem}
              onPress={() => onAddReaction(message._id, 4)}
            >
              <Image
                source={require("../../assets/wow.png")}
                style={styles.reactIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.reactItem}
              onPress={() => onAddReaction(message._id, 5)}
            >
              <Image
                source={require("../../assets/sad.png")}
                style={styles.reactIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.reactItem}
              onPress={() => onAddReaction(message._id, 6)}
            >
              <Image
                source={require("../../assets/angry.png")}
                style={styles.reactIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.options}>
            {typeOfConversation == "group" && (
              <TouchableOpacity
                onPress={() => {
                  pinMessage(message._id);
                  setIsShowModal(false);
                }}
                style={styles.optionItem}
              >
                <AntDesign
                  style={styles.optionIcon}
                  name="pushpino"
                  size={32}
                  color="#d534eb"
                />
                <Text style={styles.optionName}>Ghim</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                setIsShowModal(false);
                recallMessageOnly(message._id, message.conversationId);
              }}
              style={styles.optionItem}
            >
              <Feather
                name="trash"
                size={32}
                style={styles.optionIcon}
                color="#f22424"
              />
              <Text style={styles.optionName}>Xóa</Text>
            </TouchableOpacity>
            {isMyMessage && (
              <TouchableOpacity
                onPress={() => {
                  setIsShowModal(false);
                  recallMessage(message._id, message.conversationId);
                }}
                style={styles.optionItem}
              >
                <MaterialCommunityIcons
                  name="backup-restore"
                  style={styles.optionIcon}
                  size={32}
                  color="#d41542"
                />
                <Text style={styles.optionName}>Thu hồi</Text>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  body: {
    paddingHorizontal: 12,
    paddingVertical: 32,
  },
  avatar: {
    paddingRight: 12,
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 50,
  },
  message: {
    backgroundColor: "white",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 14,
    maxWidth: "80%",
    borderWidth: 1,
    borderColor: "#1a69d9",
    marginBottom: 12,
  },
  myMessage: {
    backgroundColor: "#e5efff",
    marginLeft: "auto",
  },
  senderName: {
    color: "#bd6d29",
  },
  content: {
    fontSize: 17,
    textAlign: "justify",
  },
  imageContent: {
    width: 250,
    height: 200,
  },
  time: {
    paddingTop: 8,
    color: "#666",
  },
  reactList: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 14,
    marginTop: 10,
  },
  reactItem: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  reactIcon: {
    width: 32,
    height: 32,
  },
  options: {
    backgroundColor: "white",
    flexDirection: "row",
    flexWrap: "wrap",
    borderRadius: 14,
    marginTop: 4,
  },
  optionItem: {
    padding: 12,
    width: "25%",
    justifyContent: "center",
    alignItems: "center",
  },
  optionIcon: {},
  optionName: {
    paddingTop: 8,
  },
  file: {
    flexDirection: "row",
    backgroundColor: "#b2c7d4",
    padding: 8,
    borderRadius: 4,
  },
  link: {
    color: "blue",
    marginRight: 32,
    paddingLeft: 4,
    fontSize: 14,
  },
});

export default ReactModal;
