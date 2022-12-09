import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import messApi from "../api/messApi";
import MessApi from "../api/messApi";
import { useConversationContext } from "../store/contexts/ConversationContext";
import { useGlobalContext } from "../store/contexts/GlobalContext";

const HandleConverIo = () => {
  const {
    socket,
    loadAllConversation,
    convers,
    addNewMessage,
    updateMessage,
    setconvers,
    updateConver,
    getConverById,
    loadAllMemberOfConver,
    deleteConver,
    addManagerOfline,
    deleteManagerOffline,
    updateLastViewOffline,
    addTypingUser,
    removeTypingUser,
    addReactionOffline,
  } = useConversationContext();
  const { user } = useGlobalContext();

  useEffect(() => {
    if (socket) {
      console.log("reload io");
      remove(socket);
      handle(socket);
    }
    return () => {};
  }, [user, socket, convers.length]);

  function handle(socket) {
    // khi tạo một conver
    socket.on("create-group-conversation", (data) => {
      console.log("create-group-conversation --- " + user.name);
      loadAllConversation();
    });

    // tạo một cuộc trò chuyện đôi
    socket.on("create-simple-conversation", (data) => {
      console.log("create-simple-conversation --- ", user.name);
      loadAllConversation();
    });

    // tin nhắn mới - done
    socket.on("new-message", async ({ message }) => {
      console.log("emit new-message");
      addNewMessage(message);
    });

    // tin nhắn bị thu hồi với tất cả mọi người - done
    socket.on("delete-message", ({ message }) => {
      message.isDeleted = true;
      updateMessage(message);
    });

    // thêm trưởng nhóm - done
    socket.on("add-managers", ({ conversationId, managerIds }) => {
      console.log("emit add-managers ---", user.name);
      addManagerOfline(conversationId, managerIds);
    });

    // delete manager - done
    socket.on("delete-managers", ({ conversationId, managerIds }) => {
      console.log("emit delete-managers", user.name);
      deleteManagerOffline(conversationId, managerIds[0]);
    });

    // khi bị xóa khỏi group - done
    socket.on("deleted-group", (converId) => {
      console.log("emit deleted-group ---", user.name);
      deleteConver(converId);
    });

    // when add member - done
    socket.on("update-member", (converId) => {
      console.log("emit update-member" + "---" + user.name);
      loadAllMemberOfConver(converId);
    });

    // được ai đó add vào group - done
    socket.on("added-group", (converId) => {
      console.log("emit added-group ---" + user.name);
      loadAllConversation();
    });

    // rename - done
    socket.on("rename-conversation", (converId, name, saveMessage) => {
      console.log("emit rename-conversation");
      let _convers = [...convers];
      let newConvers = _convers.map((cv) => {
        if (cv._id == converId) {
          cv.name = name;
        }
        return cv;
      });
      setconvers(newConvers);
    });

    // cập nhật avatar - done
    socket.on(
      "update-avatar-conversation",
      (converId, avatarUrl, saveMessage) => {
        console.log("emit update-avatar-conversation");

        let _newConver = getConverById(converId);
        _newConver.avatar = avatarUrl;
        updateConver(_newConver);
      }
    );

    //// handle typing
    socket.on("typing", (converId, userId) => {
      console.log("emit typing", converId, userId + "----" + user.name);
      addTypingUser(converId, userId);
    });
    socket.on("not-typing", (converId, userId) => {
      console.log("emit not-typing", converId, userId + "----" + user.name);
      removeTypingUser(converId, userId);
    });

    ////// lastView handle

    // add-reaction
    socket.on("add-reaction", ({ conversationId, messageId, user, type }) => {
      console.log("emit add-reaction");
      addReactionOffline(conversationId, messageId, user.id, type);
    });
  }

  function remove(socket) {
    socket.removeListener("create-group-conversation");
    socket.removeListener("new-message");
    socket.removeListener("delete-message");
    socket.removeListener("add-managers");
    socket.removeListener("delete-managers");
    socket.removeListener("update-member");
    socket.removeListener("deleted-group");
    socket.removeListener("rename-conversation");
    socket.removeListener("update-avatar-conversation");
    socket.removeListener("added-group");
    socket.removeListener("typing");
    socket.removeListener("not-typing");
    socket.removeListener("add-reaction");
  }

  return <View></View>;
};

const styles = StyleSheet.create({});

export default HandleConverIo;
