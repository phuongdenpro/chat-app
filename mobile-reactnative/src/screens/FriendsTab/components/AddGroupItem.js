import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
const AddGroupItem = (props) => {
  const { _id, name, avatar, pushMember, removeMember, checkIsExistsInGroup } =
    props;

  const [isSelected, setisSelected] = useState(false);

  function onSelect() {
    setisSelected(!isSelected);
  }

  useEffect(() => {
    if (isSelected) {
      pushMember(_id);
    } else {
      removeMember(_id);
    }
    return () => {};
  }, [isSelected]);

  return (
    <Pressable style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={require("../../../../assets/avatar.jpg")}
          style={styles.avatar}
        ></Image>
      </View>
      <View style={styles.middle}>
        <Text style={styles.name}>{name}</Text>
      </View>

      <View style={styles.right}>
        {checkIsExistsInGroup && checkIsExistsInGroup(_id) ? (
          <Text style={styles.existsInGroupText}>Đã vào nhóm</Text>
        ) : (
          <Pressable
            style={[
              styles.btnContainer,
              isSelected && styles.btnContainerSelected,
            ]}
            onPress={onSelect}
          >
            <Text style={[styles.btn, isSelected && styles.btnSelected]}></Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
    backgroundColor: "white",
  },
  avatarContainer: {},
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  middle: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
  },
  right: {
    marginRight: 12,
  },
  btnContainer: {
    padding: 12,
  },
  btnContainer: {
    height: 20,
    width: 20,
    backgroundColor: "white",
    borderColor: "#777",
    borderWidth: 1,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  btnContainerSelected: {
    // backgroundColor: "#1a69d9",
    borderColor: "#1a69d9",
  },
  btn: {
    height: 14,
    width: 14,
    borderRadius: 50,
    backgroundColor: "white",
  },
  btnSelected: {
    backgroundColor: "#1a69d9",
  },
});

export default AddGroupItem;
