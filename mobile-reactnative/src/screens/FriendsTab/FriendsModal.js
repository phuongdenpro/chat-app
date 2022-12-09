import React from "react";
import { View, StyleSheet, Modal, Text } from "react-native";

const FriendsModal = ({ isModalShow, setIsModalShow }) => {
  return (
    <Modal visible={isModalShow}>
      <View>
        <Text>Modal of friends</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({});

export default FriendsModal;
