import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { View, StyleSheet } from "react-native";
import converApi from "../../api/converApi";
import startSocketIO from "../../socketIo";
import { useGlobalContext } from "./GlobalContext";
import memberApi from "../../api/memberApi";
import messApi from "../../api/messApi";

const ConversationContext = createContext();

const ConversationContextProvider = ({ children }) => {
  const [convers, setconvers] = useState([]);
  const [hasListens, sethasListens] = useState({});
  const { user } = useGlobalContext();
  const socketRef = useRef();
  const [lastViews, setLastViews] = useState([]);
  const [typingList, setTypingList] = useState({});
  const [pinMessages, setPinMessages] = useState([]);

  // io listen converId
  // useEffect(() => {
  //   if (convers) {
  //     const _hasListens = { ...hasListens };
  //     convers.forEach((conv) => {
  //       if (!_hasListens[conv._id]) {
  //         socketRef.current.on(conv._id, (data) => {
  //           // when hava new mesage
  //           if (data.type == "new-message") {
  //             console.log("socket:  hava new-message from server");
  //             newMessage(data);
  //           }
  //         });

  //         _hasListens[conv._id] = true;
  //       }
  //     });
  //     sethasListens(_hasListens);
  //   }
  //   return () => {};
  // }, [convers]);

  useEffect(() => {
    if (user) {
      console.log("load .....");
      connectIo();
      loadAllConversation();
    }
    return () => {};
  }, [user]);

  useEffect(() => {
    if (convers && convers.length > 0) {
      console.log("load last view");
      loadAllLastViews();
      initTypingList();
    }
    return () => {};
  }, [convers.length]);

  // init typingList
  function initTypingList() {
    let _typingList = { ...typingList };

    convers.forEach((conv) => {
      if (!_typingList[conv._id]) {
        _typingList[conv._id] = [];
      }
    });
    setTypingList(_typingList);
  }

  // load and setting io
  async function connectIo() {
    // if (!socketRef.current || !socketRef.current.connected) {
    console.log("io start");
    socketRef.current = await startSocketIO();
    socketRef.current.on("connect", () => {
      console.log("socket: connect");
    });
    // }
  }

  async function loadAllConversation() {
    try {
      const res = await converApi.getAllConvers();
      if (res.isSuccess) {
        setconvers(res.data);
      }
    } catch (error) {}
  }

  async function sendMessage(props) {
    console.log(props);
    const { type, conversationId } = props;

    if (type == "TEXT") {
      const { content } = props;

      try {
        const res = await converApi.addTextMessage(conversationId, content);
        if (res.isSuccess) {
          console.log("send message ok");
          return true;
        }
        console.log("send mesage fail");
      } catch (error) {
        console.log("send message err", error);
      }
    } else {
      console.log("Chưa viết xử lí type =" + type);
      return false;
    }
  }

  // thêm mới message offline
  function addNewMessage(newMessage) {
    let _conv = getConverById(newMessage.conversationId);
    _conv.messages.push(newMessage);
    _conv.lastMessageId = { ...newMessage };

    updateConver(_conv);
  }

  // cập nhật thay đổi của 1  message offine
  function updateMessage(newMessage) {
    let _conv = getConverById(newMessage.conversationId);
    let index = -1;
    for (let i = 0; i < _conv.messages.length; i++) {
      if (_conv.messages[i]._id == newMessage._id) {
        index = i;
        break;
      }
    }
    _conv.messages.splice(index, 1, newMessage);
    updateConver(_conv);
  }

  function getMembers(converId) {
    for (let i = 0; i < convers.length; i++) {
      if (converId == convers[i]._id) {
        return convers[i].members;
      }
    }
  }

  async function sendImageMessage(converId, pickerResult) {
    try {
      const res = await converApi.sendImageMessage(converId, pickerResult);
      if (res.isSuccess) {
        // await loadAllConversation();
        console.log("send image ok");
        return true;
      }
    } catch (error) {
      console.log("send image err:", error);
    }
  }

  // offline
  function getMember(converId, memberId) {
    const members = getMembers(converId);
    if (Array.isArray(members))
      for (let i = 0; i < members.length; i++) {
        if (members[i]._id === memberId) {
          return members[i];
        }
      }
  }

  // offline
  function addNewConver(conver) {
    setconvers([conver, ...convers]);
  }

  // get conver by id offline
  function getConverById(_id) {
    for (let i = 0; i < convers.length; i++) {
      if (convers[i]._id == _id) {
        return convers[i];
      }
    }
  }

  // create simple conver
  async function createSimpleConver(_id) {
    try {
      const res = await converApi.createSimpleChat({ userId: _id });
      console.log("res", res);
      if (res.isSuccess) {
        console.log("create ok");
        await loadAllConversation();
        return res._id;
      } else {
        console.log("create faild");
        return false;
      }
    } catch (error) {
      console.log("create simple conver err", error);
      return false;
    }
  }

  // recall message == delete message
  async function recallMessage(_id, converId) {
    try {
      const res = await converApi.recallMessage(_id, converId);
      // await loadAllMessageByConverId(converId);
      await loadAllConversation();

      return true;
    } catch (error) {
      console.log("recall message err", error);
      return false;
    }
  }

  // recall message only me
  async function recallMessageOnly(_id, converId) {
    try {
      const res = await converApi.recallMessageOnly(_id, converId);
      if (res.isSuccess) {
        console.log("recall success");
        let _conv = getConverById(converId);
        let _mess = _conv.messages;
        _mess = _mess.map((item) => {
          if (item._id == _id) {
            console.log(item.deletedWithUserIds.length);
            item.deletedWithUserIds.push(user._id);
            console.log(item.deletedWithUserIds.length);
          }
          return item;
        });
        _conv.messages = _mess;
        updateConver(_conv);
        return true;
      }
    } catch (error) {
      console.log("recall message only err", error);
      return false;
    }
  }

  // leave group
  async function leaveGroup(converId) {
    try {
      const res = await converApi.leaveGroup(converId);
      console.log(res);
      if (res.isSuccess) {
        console.log("leave ok");
        let _convers = [...convers];

        let newArr = _convers.filter((conver) => {
          return conver._id != converId;
        });

        setconvers(newArr);

        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log("leave group err", error);
      return false;
    }
  }

  // rename conver
  async function renameConver(converId, newName) {
    try {
      const res = await converApi.rename(converId, newName);
      if (res.isSuccess) {
        console.log("rename ok");
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log("rename errr", error);
      return false;
    }
  }

  // update avatar
  async function updateAvatar(converId, pickerResult) {
    let localUri = pickerResult.uri;
    let filename = localUri.split("/").pop();

    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    let formData = new FormData();
    formData.append("file", { uri: localUri, name: filename, type });

    try {
      const res = await converApi.updateAvatar(converId, formData);
      if (res.isSuccess) {
        console.log("update success");
        return true;
      }
    } catch (error) {
      console.log("update avatar err:", error);
    }
  }

  // add members
  async function addMembers(converId, userIds) {
    try {
      const res = await converApi.addMembers(converId, userIds);
      if (res.isSuccess) {
        console.log("add members ok");
        return true;
      }
    } catch (error) {
      console.log("add members err", error);
      return false;
    }
  }

  // get all members of conver
  async function loadAllMemberOfConver(converId) {
    try {
      const res = await memberApi.getAllMembers(converId);
      if (res.isSuccess) {
        let _data = res.data;
        let _members = _data.map((item) => {
          return item.userId;
        });

        const _newConver = getConverById(converId);
        _newConver.members = _members;
        updateConver(_newConver);
        return true;
      }
    } catch (error) {
      console.log("get mmebers err", error);
    }
  }

  // delete a conver offline
  function deleteConver(converId) {
    let _convers = [...convers];

    let newConvers = _convers.filter((conv) => {
      return conv._id != converId;
    });
    setconvers(newConvers);
  }

  // delete history messages at my side
  async function deleteHistoryMessages(converId) {
    try {
      const res = await converApi.deleteHistoryMessages(converId);
      if (res.isSuccess) {
        console.log("delete history ok");
        await loadAllConversation();
        return true;
      } else {
        console.log("dlte history faild");
      }
    } catch (error) {
      console.log("delete hist err", error);
    }
  }

  // delete member
  async function deleteMember(converId, memberId) {
    try {
      const res = await converApi.deleteMember(converId, memberId);
      if (res.isSuccess) {
        console.log("delete member ok");
        let newConver = getConverById(converId);

        let _members = newConver.members;
        console.log(_members.length);
        let index = -1;

        for (let i = 0; i < _members.length; i++) {
          if (_members[i]._id == memberId) {
            index = i;
          }
        }

        if (index >= 0) {
          _members.splice(index, 1);
        }

        console.log(_members.length);
        newConver.members = _members;
        updateConver(newConver);

        return true;
      }
    } catch (error) {
      console.log("delete member error", error);
    }
  }

  // add manager
  async function addManager(converId, memberId) {
    try {
      const res = await converApi.addManager(converId, memberId);
      if (res.isSuccess) {
        console.log("add manager ok");
        return true;
      } else {
        console.log("add manager faild");
      }
    } catch (error) {
      console.log("add manager err", error);
    }
  }

  // add manager offline
  function addManagerOfline(converId, managerIds) {
    let newConver = getConverById(converId);
    newConver.managerIds.push(managerIds[0]);
    updateConver(newConver);
  }

  // remove manager
  async function deleteManager(converId, memberId) {
    try {
      const res = await converApi.deleteManager(converId, memberId);
      if (res.isSuccess) {
        console.log("delete manager ok");
        deleteManagerOffline(converId, memberId);
        return true;
      } else {
        console.log("delete manager faild");
      }
    } catch (error) {
      console.log("delete manager err", error);
    }
  }

  // delete manager offline
  function deleteManagerOffline(converId, memberId) {
    let newConver = getConverById(converId);
    newConver.managerIds.splice(newConver.managerIds.indexOf(memberId), 1);
    updateConver(newConver);
  }

  //update conver offline
  function updateConver(newConver) {
    let _convers = [...convers];

    _convers = _convers.map((conver) => {
      if (newConver._id == conver._id) return newConver;
      return conver;
    });

    setconvers(_convers);
  }

  // delete group by leader
  async function deleteGroupByLeader(converId) {
    try {
      const res = await converApi.deleteGroupByLeader(converId);
      if (res.isSuccess) {
        console.log("delete group ok");
        let _convers = [...convers];
        _convers = _convers.filter((conv) => {
          return conv._id != converId;
        });
        setconvers(_convers);

        return true;
      }
      console.log("delete group faild");
    } catch (error) {
      console.log("delete group err", error);
    }
  }

  // send file
  async function sendFile(converId, pickerResult) {
    try {
      const res = await converApi.sendFile(converId, pickerResult);
      if (res.isSuccess) {
        console.log("send file ok");
        return true;
      }
      console.log("send file faild");
    } catch (error) {
      console.log("send file errr", error);
    }
  }

  // add reaction
  async function addReaction(messageId, typeOfReact) {
    try {
      const res = await messApi.addReaction(messageId, typeOfReact);
      if (res.isSuccess) {
        console.log("add reaction ok");
        return true;
      } else {
        console.log("add react faild");
      }
    } catch (error) {
      console.log("add reaction err");
    }
  }

  function addReactionOffline(converId, messageId, userId, typeOfReact) {
    let _conver = getConverById(converId);
    let _messages = _conver.messages;

    for (let i = 0; i < _messages.length; i++) {
      if (_messages[i]._id == messageId) {
        let _reacts = _messages[i].reacts.filter((reactItem) => {
          return reactItem.userId != userId;
        });
        _reacts.push({
          _id: messageId,
          type: typeOfReact,
          userId,
        });
        _messages[i].reacts = _reacts;
        break;
      }
    }

    updateConver(_conver);
  }

  //// handle lastView
  // load all lastview
  async function loadAllLastViews() {
    try {
      const res = await memberApi.getAllLastView();
      if (res.isSuccess) {
        setLastViews(res.data);
      }
    } catch (error) {
      console.log("load all last view err", error);
    }
  }

  // update lastVeiw offline
  function updateLastViewOffline(converId) {
    const _lasVs = [...lastViews];
    for (let i = 0; i < _lasVs.length; i++) {
      if (_lasVs[i].conversationId == converId) {
        _lasVs[i].lastView = new Date();
      }
    }
    setLastViews(_lasVs);
  }

  // handle add typing
  function addTypingUser(converId, userId) {
    console.log(typingList);
    let _typingList = { ...typingList };
    console.log(_typingList);

    if (!_typingList[converId]) {
      _typingList[converId] = [];
    }

    if (
      Array.isArray(_typingList[converId]) &&
      _typingList[converId].indexOf(userId) == -1
    ) {
      console.log("add");
      _typingList[converId].push(userId);
    }

    setTypingList({ ..._typingList });
  }

  // handle remove typing
  function removeTypingUser(converId, userId) {
    let _typingList = { ...typingList };
    let index = -1;
    if (_typingList[converId] && Array.isArray(_typingList[converId])) {
      index = _typingList[converId].indexOf(userId);
    }

    if (index != -1) {
      _typingList[converId].splice(index, 1);
      console.log("remove");
    }
    console.log(_typingList);
    setTypingList({ ..._typingList });
  }

  // pin message
  async function pinMessage(messageId) {
    try {
      const res = await messApi.pinMessage(messageId);
      if (res.isSuccess) {
        console.log("pin message ok");

        return true;
      } else {
        console.log("pin message faild");
      }
    } catch (error) {
      console.log("pin message error");
    }
  }

  const ConversationContextData = {
    convers: convers,
    setconvers,
    getMembers,
    getMember,
    sendMessage,
    addNewConver,
    getConverById,
    createSimpleConver,
    recallMessage,
    recallMessageOnly,
    leaveGroup,
    renameConver,
    updateAvatar,
    sendImageMessage,
    addMembers,
    deleteHistoryMessages,
    deleteMember,
    addManager,
    deleteManager,
    loadAllConversation,
    addNewMessage,
    updateMessage,
    updateConver,
    loadAllMemberOfConver,
    deleteConver,
    addManagerOfline,
    deleteGroupByLeader,
    socket: socketRef.current,
    deleteManagerOffline,
    updateLastViewOffline,
    lastViews,
    sendFile,
    typingList,
    addTypingUser,
    removeTypingUser,
    pinMessage,
    addReaction,
    addReactionOffline,
  };
  return (
    <ConversationContext.Provider value={ConversationContextData}>
      {children}
    </ConversationContext.Provider>
  );
};

const styles = StyleSheet.create({});

export default ConversationContextProvider;
export function useConversationContext() {
  return useContext(ConversationContext);
}
