import React from "react";
import { View, StyleSheet, Text, Image, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import GroupChatItem from "./GroupChatItem";
import { useConversationContext } from "../../../store/contexts/ConversationContext";

const GroupChatBody = ({ navigation }) => {
  const { convers } = useConversationContext();

  function renderItem({ item, index }) {
    if (item.type == true) {
      return <GroupChatItem {...item} index={index} />;
    }
  }

  function count() {
    let num = 0;
    convers.forEach((element) => {
      if (element.type == true) {
        num++;
      }
    });
    return num;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="group-add" size={24} color="white" />
        </View>
        <Text
          onPress={() => navigation.navigate("AddGroupChat")}
          style={styles.headerText}
        >
          Tạo nhóm mới
        </Text>
      </View>
      <View style={styles.body}>
        <View style={styles.numOfGroupContainer}>
          <Text style={styles.numOfGroup}>Nhóm đang tham gia ({count()})</Text>
        </View>
        <View style={styles.list}>
          <FlatList
            renderItem={renderItem}
            data={convers}
            keyExtractor={(item) => item._id}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderBottomWidth: 8,
    borderBottomColor: "#eee",
    paddingVertical: 12,
  },
  iconContainer: {
    padding: 8,
    backgroundColor: "#3483eb",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerText: {},
  body: {
    flex: 1,
  },
  numOfGroupContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  numOfGroup: {
    fontWeight: "bold",
  },
  list: {
    flex: 1,
  },
});

export default GroupChatBody;
