import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Text,
  Pressable,
} from "react-native";

import {
  AntDesign,
  EvilIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const HeaderTitleMessage = (props) => {
  const { navigation } = props;
  const [searchInput, setSearchInput] = useState("");
  const [isVisibleModal, setIsVisibleModal] = useState(false);

  function onPlusHeaderPress() {
    setIsVisibleModal(true);
  }

  function onSearchPress() {
    console.warn("search press");
  }

  function onAddFriend() {
    navigation.navigate("FriendsTab", {
      screen: "Friends",
      params: {
        screen: "AddFriend",
      },
    });
  }

  function onCreateGroup() {
    navigation.navigate("FriendsTab", {
      screen: "Friends",
      params: {
        screen: "AddGroupChat",
      },
    });
  }

  function onCloseModal() {
    setIsVisibleModal(false);
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.icon} onPress={onSearchPress}>
        <EvilIcons name="search" size={36} color="white" />
      </Pressable>
      <TouchableOpacity style={styles.middle}>
        <TextInput
          style={styles.input}
          placeholder="Tìm kiếm..."
          placeholderTextColor={"white"}
          value={searchInput}
          onChangeText={setSearchInput}
        />
      </TouchableOpacity>
      <Pressable style={styles.right}>
        <TouchableOpacity style={styles.rightIcon} onPress={onPlusHeaderPress}>
          <AntDesign name="plus" size={30} color="white" />
        </TouchableOpacity>
      </Pressable>
      <Modal transparent={true} visible={isVisibleModal}>
        <Pressable style={styles.modalWraper} onPress={onCloseModal}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalItemContainer}
              onPress={onAddFriend}
            >
              <MaterialCommunityIcons
                style={styles.modalItemIcon}
                name="account-plus-outline"
                size={24}
                color="black"
              />
              <Text style={styles.modalItemText}>Thêm bạn</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalItemContainer}
              onPress={onCreateGroup}
            >
              <MaterialCommunityIcons
                style={styles.modalItemIcon}
                name="account-multiple-plus-outline"
                size={24}
                color="black"
              />
              <Text style={styles.modalItemText}>Tạo nhóm</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    paddingVertical: 12,
    paddingRight: 8,
  },
  middle: {
    flex: 1,
  },
  input: {
    fontSize: 17,
    color: "white",
  },
  right: {
    paddingLeft: 8,
    paddingVertical: 12,
  },
  modalWraper: {
    height: "100%",
  },
  modalContainer: {
    backgroundColor: "white",
    width: 200,
    marginLeft: "auto",
    marginRight: 12,
    marginTop: 8,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,

    elevation: 3,
  },
  modalItemContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  modalItemText: {
    marginLeft: 8,
  },
});

export default HeaderTitleMessage;
