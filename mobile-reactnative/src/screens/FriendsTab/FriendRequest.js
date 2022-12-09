import React, { useState } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import { useFriendContext } from "../../store/contexts/FriendContext";
import AddFriendItem from "./components/AddFriendItem";
import FriendRequestReceiveItem from "./components/FriendRequestReceiveItem";

const FriendRequest = () => {
  const [activeTab, setactiveTab] = useState(true);

  const { requestFromMe, requestToMe } = useFriendContext();

  function renderRequestToMeItem({ item }) {
    return <FriendRequestReceiveItem {...item} />;
  }

  function renderRequestFromMeItem({ item }) {
    const { receiverId } = item;
    return <AddFriendItem {...receiverId} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text
          onPress={() => setactiveTab(true)}
          style={[styles.navItem, activeTab && styles.navItemAcctive]}
        >
          ĐÃ NHẬN {requestToMe && requestToMe.length}
        </Text>
        <Text
          onPress={() => setactiveTab(false)}
          style={[styles.navItem, !activeTab && styles.navItemAcctive]}
        >
          ĐÃ GỬI {requestFromMe && requestFromMe.length}
        </Text>
      </View>
      <View style={styles.body}>
        {activeTab ? (
          <FlatList
            renderItem={renderRequestToMeItem}
            data={requestToMe}
            keyExtractor={(item) => item._id}
          />
        ) : (
          <FlatList
            renderItem={renderRequestFromMeItem}
            data={requestFromMe}
            keyExtractor={(item) => item._id}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  navItem: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    paddingVertical: 8,
    color: "#ccc",
  },
  navItemAcctive: {
    borderBottomWidth: 4,
    borderBottomColor: "blue",
    color: "black",
  },
  body: {},
});

export default FriendRequest;
