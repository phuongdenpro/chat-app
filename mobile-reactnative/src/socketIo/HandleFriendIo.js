import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useConversationContext } from "../store/contexts/ConversationContext";
import { useFriendContext } from "../store/contexts/FriendContext";
import { useGlobalContext } from "../store/contexts/GlobalContext";

const HandleFriendIo = () => {
  const { socket } = useConversationContext();
  const { loadFriends, loadAllRequestToMe, loadAllRequestFromMe } =
    useFriendContext();
  const { user } = useGlobalContext();

  useEffect(() => {
    if (socket) {
      removeListentIo(socket);
      handle(socket);
    }
    return () => {};
  }, [user, socket]);

  function handle(socket) {
    // gửi yêu cầu kết bạn
    socket.on("send-friend-invite", (data) => {
      loadAllRequestToMe();
      loadAllRequestFromMe();
    });

    // chấp nhận kết bạn
    socket.on("accept-friend", (data) => {
      console.log("emit accept-friend" + "--" + user.name);
      loadAllRequestToMe();
      loadFriends();
      loadAllRequestFromMe();
    });

    // xóa bạn
    socket.on("deleted-friend", (userId) => {
      console.log("emit deleted-friend" + "--" + user.name);
      loadAllRequestToMe();
      loadFriends();
      loadAllRequestFromMe();
    });

    // thu hồi request đã gửi
    socket.on("deleted-invite-was-send", (data) => {
      console.log("deleted-invite-was-send" + "---" + user.name);
      loadAllRequestToMe();
      loadAllRequestFromMe();
    });

    // từ chối kết bạn
    socket.on("deleted-friend-invite", (data) => {
      console.log("emit deleted-friend-invite" + "---" + user.name);
      loadAllRequestToMe();
      loadAllRequestFromMe();
    });

    socket.on("user-online", (userId) => {
      console.log("emit user-online ---", userId);
      loadFriends();
    });
    socket.on("user-offline", (userId) => {
      console.log("emit user-offline ---", userId);
      loadFriends();
    });
  }

  function removeListentIo(socket) {
    socket.removeListener("accept-friend");
    socket.removeListener("deleted-friend");
    socket.removeListener("send-friend-invite");
    socket.removeListener("deleted-friend-invite");
    socket.removeListener("deleted-invite-was-send");
    socket.removeListener("user-online");
    socket.removeListener("user-offline");
  }

  return <View></View>;
};

const styles = StyleSheet.create({});

export default HandleFriendIo;
