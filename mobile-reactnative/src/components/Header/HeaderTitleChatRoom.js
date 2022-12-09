import React, { useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import HeaderTitleChatRoomGroup from "./HeaderTitleChatRoomGroup";
import HeaderTitlteChatRoomSimple from "./HeaderTitlteChatRoomSimple";

const HeaderTitleChatRoom = (props) => {
  const { typeOfConversation, conver } = props;

  return (
    <>
      {typeOfConversation && typeOfConversation == "group" ? (
        <HeaderTitleChatRoomGroup {...props} />
      ) : (
        <HeaderTitlteChatRoomSimple {...props} />
      )}
    </>
  );
};

export default HeaderTitleChatRoom;
