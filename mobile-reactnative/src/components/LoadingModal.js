import React from "react";
import { View, StyleSheet, ActivityIndicator, Modal, Text } from "react-native";

const LoadingModal = ({ visible, text }) => {
  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.text}>{text ? text : "Đang tải..."}</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  text: {
    fontSize: 15,
    paddingTop: 12,
    color: "white",
  },
});

export default LoadingModal;
