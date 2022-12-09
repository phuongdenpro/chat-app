import React, { createContext, useContext, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useGlobalContext } from "./GlobalContext";
import friendApi from "../../api/friendApi";
import { set } from "react-native-reanimated";
import { useConversationContext } from "./ConversationContext";
import userApi from "../../api/userApi";

const FriendContext = createContext();

const FriendContextProvider = ({ children }) => {
  const [friends, setfriends] = useState([]);
  const [requestToMe, setRequestToMe] = useState([]);
  const [requestFromMe, setRequestFromMe] = useState([]);
  const { user } = useGlobalContext();

  useEffect(() => {
    if (user) {
      loadFriends();
      loadAllRequestToMe();
      loadAllRequestFromMe();
    }
    return () => {};
  }, [user]);

  // load all request from me
  async function loadAllRequestFromMe() {
    try {
      const res = await friendApi.getAllRequestFromMe();
      if (res.isSuccess) {
        setRequestFromMe(res.data);
      } else {
        setRequestFromMe([]);
      }
    } catch (err) {
      console.log("loadAllRequestFromMe Err:", err);
    }
  }

  // load all request to me
  async function loadAllRequestToMe() {
    try {
      const res = await friendApi.getAllRequestToMe();
      if (res.isSuccess) {
        setRequestToMe(res.data);
      } else {
        setRequestToMe([]);
      }
    } catch (err) {
      console.log("loadAllRequestToMe Err:", err);
    }
  }

  async function loadFriends() {
    const res = await friendApi.getAllFriends();
    if (res.isSuccess) {
      setfriends(res.data);
    } else {
      console.log("not found friends");
    }
  }

  function checkIsMyFriend(_id) {
    for (let i = 0; i < friends.length; i++) {
      if (friends[i]._id == _id) {
        return true;
      }
    }
    return false;
  }

  async function deleteFriend(_id) {
    try {
      console.log(_id);
      const res = await friendApi.deleteFriend(_id);
      if (res.isSuccess) {
        loadFriends();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log("delete friend error", error);
      return false;
    }
  }

  async function sendRequestFriend(_id) {
    try {
      const res = await friendApi.addFriend(_id);

      if (res.isSuccess) {
        loadAllRequestFromMe();
        loadFriends();
        loadAllRequestToMe();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log("request friend error", error);
      return false;
    }
  }

  async function deleteRequestFriend(_id) {
    try {
      const res = await friendApi.deleteRequest(_id);
      if (res.isSuccess) {
        console.log("thu hồi request ok");
        loadAllRequestFromMe();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log("delete request err", error);
      return false;
    }
  }

  // find user by phonumber
  async function findUserByPhoneNumber(phone) {
    try {
      const res = await userApi.findUserByPhoneNumber(phone);
      return res;
    } catch (error) {
      console.log("find user error", error);
      return null;
    }
  }

  //
  async function acceptFriend(_id) {
    try {
      const res = await friendApi.acceptFriend(_id);
      loadFriends();
      loadAllRequestToMe();
      loadAllRequestFromMe();
    } catch (error) {
      console.log("accept friend error", error);
      return false;
    }
  }

  async function refuseFriend(userId) {
    try {
      const res = await friendApi.refuseFriend(userId);
      if (res.isSuccess) {
        console.log("refuse ok");
        await loadAllRequestToMe();
        return true;
      }
      console.log("refuse friend faild");
    } catch (error) {
      console.log("refuse friend err", error);
    }
  }

  // check is exists in request from me
  function checkIsRequested(_id) {
    const _requestFromMe = [...requestFromMe];

    for (let i = 0; i < _requestFromMe.length; i++) {
      if (_requestFromMe[i].receiverId._id == _id) return true;
    }
    return false;
  }

  // kiểm tra xem có gửi yêu cầu kết bạn với mình không
  function checkIsRequestedToMe(_id) {
    const _requestToMe = [...requestToMe];

    for (let i = 0; i < _requestToMe.length; i++) {
      if (_requestToMe[i].senderId._id == _id) return true;
    }
    return false;
  }

  const FriendContextData = {
    friends,
    checkIsMyFriend,
    requestFromMe,
    requestToMe,
    deleteFriend,
    sendRequestFriend,
    checkIsRequested,
    deleteRequestFriend,
    findUserByPhoneNumber,
    acceptFriend,
    checkIsRequestedToMe,
    loadFriends,
    loadAllRequestToMe,
    loadAllRequestFromMe,
    refuseFriend,
  };
  return (
    <FriendContext.Provider value={FriendContextData}>
      {children}
    </FriendContext.Provider>
  );
};

const styles = StyleSheet.create({});

export default FriendContextProvider;
export function useFriendContext() {
  return useContext(FriendContext);
}
