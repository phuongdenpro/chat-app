import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Touchable,
  useWindowDimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import { converDate } from "../../utils";
import {
  Foundation,
  Fontisto,
  SimpleLineIcons,
  FontAwesome,
  Feather,
  AntDesign,
  MaterialCommunityIcons,
  Entypo,
} from "@expo/vector-icons";
import { useConversationContext } from "../../store/contexts/ConversationContext";

const TextMessage = ({
  item,
  isMyMessage,
  sender,
  idSelected,
  setIdSelected,
  showModalReact,
}) => {
  const { content, createdAt, _id, conversationId } = item;
  const [isShowOptions, setIsShowOptions] = useState(false);
  const date = converDate(createdAt);
  const { recallMessage, recallMessageOnly, pinMessage } =
    useConversationContext();

  useEffect(() => {
    setIsShowOptions(false);
    return () => {};
  }, [idSelected]);

  // thu hồi message
  async function onRecallMessage() {
    setIsShowOptions(false);

    let is = await recallMessage(_id, conversationId);
  }

  // ghim message
  function onPinMessage() {
    setIsShowOptions(false);
    pinMessage(_id);
    console.log("pin");
  }
  // delete message only me
  async function onDeleteMessage() {
    setIsShowOptions(false);
    const resutl = await recallMessageOnly(_id, conversationId);

    console.log("delete");
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
              source={require("../../../assets/like.png")}
              style={reactListStyles.reactIcon}
            />
          </TouchableOpacity>
        )}

        {typeCheck["2"] && (
          <TouchableOpacity style={reactListStyles.reactItem}>
            <Image
              source={require("../../../assets/love.png")}
              style={reactListStyles.reactIcon}
            />
          </TouchableOpacity>
        )}
        {typeCheck["3"] && (
          <TouchableOpacity style={reactListStyles.reactItem}>
            <Image
              source={require("../../../assets/haha.png")}
              style={reactListStyles.reactIcon}
            />
          </TouchableOpacity>
        )}
        {typeCheck["4"] && (
          <TouchableOpacity style={reactListStyles.reactItem}>
            <Image
              source={require("../../../assets/wow.png")}
              style={reactListStyles.reactIcon}
            />
          </TouchableOpacity>
        )}
        {typeCheck["5"] && (
          <TouchableOpacity style={reactListStyles.reactItem}>
            <Image
              source={require("../../../assets/sad.png")}
              style={reactListStyles.reactIcon}
            />
          </TouchableOpacity>
        )}
        {typeCheck["6"] && (
          <TouchableOpacity style={reactListStyles.reactItem}>
            <Image
              source={require("../../../assets/angry.png")}
              style={reactListStyles.reactIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  function renderBody() {
    return (
      <TouchableOpacity
        onLongPress={() => {
          showModalReact(item);
        }}
        style={[
          isMyMessage ? styles.myMessageContainer : styles.container,
          styles.wrap,
          idSelected == _id && styles.backgroundColorSelected,
        ]}
      >
        {!isMyMessage && (
          <Text style={styles.name}>{sender && sender.name}</Text>
        )}
        <Text style={[styles.text]}>{content}</Text>

        {_id == idSelected && (
          <>
            <View
              style={
                isMyMessage
                  ? styles.myOptionsContainer
                  : styles.optionsContainer
              }
            >
              {isShowOptions && (
                <View style={styles.options}>
                  <TouchableOpacity
                    onPress={onDeleteMessage}
                    style={styles.option}
                  >
                    <AntDesign name="delete" size={12} color="black" />
                    <Text style={styles.optionText}>Xóa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onPinMessage}
                    style={styles.option}
                  >
                    <AntDesign name="pushpin" size={12} color="black" />
                    <Text style={styles.optionText}>Gim</Text>
                  </TouchableOpacity>
                  {isMyMessage && (
                    <TouchableOpacity
                      onPress={onRecallMessage}
                      style={styles.option}
                    >
                      <MaterialCommunityIcons
                        name="archive-cancel"
                        size={12}
                        color="black"
                      />
                      <Text style={styles.optionText}>Thu hồi</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>

            {!isShowOptions && (
              <MaterialCommunityIcons
                style={
                  isMyMessage
                    ? styles.myDotsOfMyMessage
                    : styles.dotsOfMyMessage
                }
                name="dots-horizontal"
                size={26}
                color="black"
                onPress={() => setIsShowOptions(true)}
              />
            )}
          </>
        )}
        <Text style={styles.time}>{date.toString}</Text>
        {renderReactList(item.reacts)}
      </TouchableOpacity>
    );
  }

  return renderBody();
};

const styles = StyleSheet.create({
  wrap: {
    position: "relative",
    marginBottom: 12,
  },
  backgroundColorSelected: {
    backgroundColor: "#aaa",
  },
  container: {
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 12,
    backgroundColor: "white",
    borderRadius: 16,
    maxWidth: "75%",
  },
  myMessageContainer: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#e5efff",
    marginLeft: "auto",
    maxWidth: "75%",
  },
  name: {
    color: "#bd6d29",
  },
  text: {
    fontSize: 17,
    textAlign: "justify",
  },
  time: {
    paddingTop: 8,
    color: "#666",
  },

  optionsContainer: {
    position: "absolute",
    right: -70,
    top: "50%",
    transform: [{ translateY: -30 }],
    height: 85,
    overflow: "hidden",
  },

  myOptionsContainer: {
    position: "absolute",
    left: -70,
    top: "50%",
    transform: [{ translateY: -25 }],
    height: 85,
  },

  dotsOfMyMessage: {
    // display: "none",
    position: "absolute",
    right: -32,
    top: "50%",
    bottom: "50%",
  },
  myDotsOfMyMessage: {
    // display: "none",
    position: "absolute",
    left: -28,
    top: "50%",
    bottom: "50%",
  },
  options: {
    backgroundColor: "#bcc2c4",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#bcc2c4",
    width: 64,
  },
  option: {
    flexDirection: "row",
    // justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  optionText: {
    paddingVertical: 6,
    paddingLeft: 6,
    fontSize: 13,
  },
});

const reactListStyles = StyleSheet.create({
  // reacts style
  reactList: {
    flexDirection: "row",
    position: "absolute",
    bottom: -16,
    backgroundColor: "#bbb",
    borderRadius: 8,
    paddingRight: 4,
  },
  reactListOfMyMessage: {
    right: 0,
  },
  reactItem: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  reactItemCount: { fontSize: 12, paddingHorizontal: 4 },
  reactIcon: {
    width: 16,
    height: 16,
  },
});

export { reactListStyles };
export default TextMessage;
