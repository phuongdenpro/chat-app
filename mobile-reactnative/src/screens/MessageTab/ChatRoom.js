import { useHeaderHeight } from "@react-navigation/stack";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Keyboard,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import HeaderTitleChatRoom from "../../components/Header/HeaderTitleChatRoom";
import Message from "../../components/Message";
import MessageInput from "../../components/MessageInput";
import { useConversationContext } from "../../store/contexts/ConversationContext";
import { useGlobalContext } from "../../store/contexts/GlobalContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AntDesign, Feather } from "@expo/vector-icons";
import messApi from "../../api/messApi";
import ReactModal from "../../components/ReactModal";

const ChatRoom = (props) => {
  const { converId, name } = props.route.params;
  const { navigation } = props;
  const { user } = useGlobalContext();
  const {
    getMember,
    getMembers,
    convers,
    getConverById,
    socket,
    updateLastViewOffline,
    typingList,
  } = useConversationContext();
  const flastListRef = useRef();
  const [idSelected, setIdSelected] = useState(null);
  const [conver, setConver] = useState(null);
  const [typingItems, setTypingItems] = useState("");
  //pin
  const [pinMessages, setPinMessages] = useState([]);
  const [isShowMorePin, setIsShowMorePin] = useState(false);
  const [flastListIndexs, setFlastListIndexs] = useState({});
  const [isShowReactModal, setIsShowReactModal] = useState(false);
  const [messSelected, setMessSelected] = useState(null);

  // emit to server when close room
  useEffect(() => {
    const blurSubc = navigation.addListener("blur", () => {
      if (socket) {
        console.log("emit close-room");
        socket.emit("close-room", converId);
        updateLastViewOffline(converId);
      }
    });
    return blurSubc;
  }, [navigation]);

  useEffect(() => {
    let _conver = getConverById(converId);
    if (_conver) {
      let _mess = _conver.messages;
      let messages = [..._mess];

      messages.reverse();
      _conver = { ..._conver, messages };
      setConver(_conver);
    }
    return () => {};
  }, [convers]);

  useEffect(() => {
    let str = "";
    let userIds = typingList[converId];
    if (userIds && Array.isArray(userIds)) {
      userIds.forEach((userId) => {
        let user = getMember(converId, userId);
        if (user) {
          if (str) {
            str += ",";
          }
          str += user.name;
        }
      });
      setTypingItems(str);
    }

    return () => {};
  }, [typingList]);

  //header
  useEffect(() => {
    navigation.setOptions({
      headerTitle: (props) => (
        <HeaderTitleChatRoom
          {...props}
          typeOfConversation={
            conver && conver.type == true ? "group" : "simple"
          }
          numOfMember={getMembers(converId) && getMembers(converId).length}
          converName={name}
          navigation={navigation}
          conver={conver}
        />
      ),
    });
    // hide header
    const parent = props.navigation.dangerouslyGetParent();
    parent.setOptions({
      tabBarVisible: false,
    });
    return () =>
      parent.setOptions({
        tabBarVisible: true,
      });
  }, [conver]);

  function isDeletedWithMe(deletedWithUserIds) {
    if (deletedWithUserIds && deletedWithUserIds.length > 0) {
      for (let i = 0; i < deletedWithUserIds.length; i++) {
        if (deletedWithUserIds[i] == user._id) {
          return true;
        }
      }
    }
    return false;
  }

  // handle pin message

  useEffect(() => {
    if (conver && conver.type == true) {
      loadAllPinMessage(conver._id);
      let _indexs = { ...flastListIndexs };

      conver.messages.forEach((item, index) => {
        _indexs[item._id] = index;
      });
      setFlastListIndexs(_indexs);
    }

    return () => {};
  }, [conver]);

  async function loadAllPinMessage(converId) {
    try {
      const res = await messApi.getAllPinMessageByConverId(converId);
      if (res.isSuccess) {
        setPinMessages(res.data);
      } else {
        console.log("load pinmessage faild");
      }
    } catch (error) {
      console.log("load pinmessage err");
    }
  }
  function renderItemPinMessage({ index, item }) {
    let { type } = item;
    let count = pinMessages.length;

    return (
      <TouchableOpacity
        style={styles.pinItem}
        onPress={() => {
          setIsShowMorePin(false);
          setIdSelected(item._id);
          flastListRef.current.scrollToIndex({
            index: flastListIndexs[item._id],
          });
        }}
        onLongPress={() => showAlert(item._id)}
      >
        <View style={styles.pinIconContainer}>
          <AntDesign name="message1" size={24} color="#1a69d9" />
        </View>
        <View style={styles.pinBody}>
          <Text
            style={styles.pinContent}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {type == "TEXT" ? item.content : `[${item.type}]`}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.pinSender}>
            Tin nhắn của {item.senderId.name}
          </Text>
        </View>
        <TouchableOpacity>
          {index == 0 && count > 0 && (
            <TouchableOpacity
              style={styles.pinItemRight}
              onPress={() => setIsShowMorePin(!isShowMorePin)}
            >
              <Text style={styles.pinRightNum}>+ {count}</Text>
              {!isShowMorePin ? (
                <Feather name="chevrons-down" size={24} color="#1a69d9" />
              ) : (
                <Feather name="chevrons-up" size={24} color="#1a69d9" />
              )}
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  function showAlert(messageId) {
    Alert.alert("Bỏ ghim tin nhắn này", "", [
      {
        text: "Đồng ý",
        onPress: () => removePinMessage(messageId),
      },
      {
        text: "Quay lại",
      },
    ]);
  }

  async function removePinMessage(messageId) {
    try {
      const res = await messApi.removePinMessage(messageId);
      if (res.isSuccess) {
        console.log("remove pin ok");
        loadAllPinMessage(conver._id);
      } else {
        console.log("remove pin faild");
      }
    } catch (error) {
      console.log("remove pin message err");
    }
  }

  function renderItem({ index, item }) {
    const { senderId, deletedWithUserIds } = item;
    if (isDeletedWithMe(deletedWithUserIds, senderId._id)) {
      return null;
    }
    return (
      <Message
        isMyMessage={user._id == senderId._id ? true : false}
        item={item}
        isRenderAvatarIcon={isRenderAvatarIcon}
        index={index}
        sender={senderId}
        idSelected={idSelected}
        setIdSelected={setIdSelected}
        showModalReact={showModalReact}
      />
    );
  }

  // function on longpress message
  function showModalReact(message) {
    setIsShowReactModal(true);
    setMessSelected(message);
  }

  function isRenderAvatarIcon(senderId, index) {
    if (index == 0) {
      return true;
    }
    if (conver.messages[index - 1].senderId._id === senderId) return false;
    return true;
  }

  if (!conver)
    return (
      <View>
        <Text>Dang tai</Text>
      </View>
    );
  return (
    <View style={styles.container}>
      <View style={styles.listMessContainer}>
        {
          <FlatList
            style={styles.flatList}
            data={conver.messages}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            ref={flastListRef}
            inverted={true}
            initialNumToRender={20}
            onScroll={() => {
              setIsShowMorePin(false);
            }}
          ></FlatList>
        }
      </View>
      <View style={styles.enterContainer}>
        {typingItems && (
          <View style={styles.typingList}>
            <Text style={styles.typingItem}>{typingItems} đang nhập...</Text>
          </View>
        )}
        <MessageInput converId={converId} />
      </View>
      {pinMessages && pinMessages.length > 0 && (
        <View
          style={[styles.pinMessContainer, !isShowMorePin && { height: 50 }]}
        >
          <FlatList
            data={[...pinMessages].reverse()}
            renderItem={renderItemPinMessage}
            key={(item) => item._id}
          />
        </View>
      )}

      <ReactModal
        isShowModal={isShowReactModal}
        setIsShowModal={setIsShowReactModal}
        message={messSelected}
        typeOfConversation={conver && conver.type == true ? "group" : "simple"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#92918e",
    flex: 1,
    justifyContent: "flex-end",
    position: "relative",
    width: "100%",
  },
  listMessContainer: {
    backgroundColor: "#ddd",
    paddingTop: 60,
    height: "100%",
  },
  flatList: {
    paddingHorizontal: 12,
  },
  enterContainer: {
    height: 60,
    backgroundColor: "white",
    position: "relative",
  },
  typingList: {
    position: "absolute",
    top: -24,
    left: 0,
    right: 0,
    backgroundColor: "#ddd",
    height: 24,
    justifyContent: "center",
    paddingLeft: 12,
  },
  typingItem: {},
  pinMessContainer: {
    // width: "100%",
    position: "absolute",
    top: 4,
    left: 4,
    right: 4,
    backgroundColor: "white",
    borderRadius: 8,
    // height: 50,
  },
  pinItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  pinIconContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  pinBody: {
    flex: 1,
    paddingHorizontal: 8,
    borderRightWidth: 2,
    borderRightColor: "#eee",
  },
  pinContent: {
    fontWeight: "bold",
    fontSize: 15,
  },
  pinSender: {
    fontSize: 13,
    color: "#888",
  },
  pinItemRight: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 65,
  },
  pinRightNum: {
    fontSize: 15,
  },
});

export default ChatRoom;
