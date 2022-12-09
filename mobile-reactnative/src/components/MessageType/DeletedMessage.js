import React from "react";
import { View, StyleSheet, Text } from "react-native";

const DeletedMessage = ({ item, isMyMessage }) => {
  return (
    <View style={[styles.container, isMyMessage && styles.containerMyMessage]}>
      <Text style={[styles.text]}>Tin nhắn đã bị thu hồi</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ddd",
    borderRadius: 12,
  },
  containerMyMessage: {
    marginLeft: "auto",
  },
  text: {
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
});

export default DeletedMessage;
