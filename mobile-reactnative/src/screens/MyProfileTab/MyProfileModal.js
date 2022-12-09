import React, { useState, useEffect } from "react";
import { View, StyleSheet, Modal, Text, TouchableOpacity } from "react-native";
import { useGlobalContext } from "../../store/contexts/GlobalContext";

const MyProfileModal = ({ isModalShow, setIsModalShow }) => {
  const { onLogout } = useGlobalContext();
  function backPress() {
    setIsModalShow(false);
  }

  function agreePress() {
    setIsModalShow(false);
    onLogout();
  }

  return (
    <>
      <Modal
        transparent={true}
        visible={isModalShow}
        // animationType="slide"
        // statusBarTranslucent={true}
      >
        <View style={styles.container}>
          <View style={styles.body}>
            <Text style={styles.question}>Bạn có muốn đăng xuất không?</Text>
            <View style={styles.btnContainer}>
              <Text onPress={backPress} style={styles.textBtn}>
                Quay lại
              </Text>
              <Text
                onPress={agreePress}
                style={[styles.textBtn, styles.textAgree]}
              >
                Đăng xuất
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  body: {
    backgroundColor: "white",
    width: "90%",
    borderRadius: 1,
    padding: 24,
    alignItems: "center",
  },
  question: {
    fontSize: 20,
    paddingBottom: 32,
    fontWeight: "bold",
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
  },
  textBtn: {
    marginLeft: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  textAgree: {
    color: "red",
    fontWeight: "700",
  },
});

export default MyProfileModal;
