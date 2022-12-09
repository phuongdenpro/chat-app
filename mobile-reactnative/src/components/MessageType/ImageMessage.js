import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { useGlobalContext } from "../../store/contexts/GlobalContext";
import { reactListStyles } from "./TextMessage";

const ImageMessage = (props) => {
  const { item, showModalReact } = props;
  const { user } = useGlobalContext();
  let isMyMessage = user._id == item.senderId._id;

  function renderReactList(reacts) {
    if (!reacts || (reacts && reacts.length == 0)) return null;
    let typeCheck = {};
    reacts.forEach((item) => {
      typeCheck[item.type] = true;
    });

    return (
      <View
        style={[
          reactListStyles.reactList,
          isMyMessage && reactListStyles.reactListOfMyMessage,
        ]}
      >
        <View style={reactListStyles.reactItem}>
          <Text style={reactListStyles.reactItemCount}>{reacts.length}</Text>
        </View>
        {typeCheck["1"] && (
          <TouchableOpacity style={reactListStyles.reactItem}>
            <Image
              source={require("../../../assets/like.png")}
              style={reactListStyles.reactIcon}
            />
          </TouchableOpacity>
        )}

        {typeCheck["2"] && (
          <TouchableOpacity style={reactListStyles.reactItem}>
            <Image
              source={require("../../../assets/love.png")}
              style={reactListStyles.reactIcon}
            />
          </TouchableOpacity>
        )}
        {typeCheck["3"] && (
          <TouchableOpacity style={reactListStyles.reactItem}>
            <Image
              source={require("../../../assets/haha.png")}
              style={reactListStyles.reactIcon}
            />
          </TouchableOpacity>
        )}
        {typeCheck["4"] && (
          <TouchableOpacity style={reactListStyles.reactItem}>
            <Image
              source={require("../../../assets/wow.png")}
              style={reactListStyles.reactIcon}
            />
          </TouchableOpacity>
        )}
        {typeCheck["5"] && (
          <TouchableOpacity style={reactListStyles.reactItem}>
            <Image
              source={require("../../../assets/sad.png")}
              style={reactListStyles.reactIcon}
            />
          </TouchableOpacity>
        )}
        {typeCheck["6"] && (
          <TouchableOpacity style={reactListStyles.reactItem}>
            <Image
              source={require("../../../assets/angry.png")}
              style={reactListStyles.reactIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <TouchableOpacity
      onLongPress={() => showModalReact(item)}
      style={styles.container}
    >
      <View style={[isMyMessage ? styles.bodyOfMyMessage : styles.body]}>
        <Image source={{ uri: item.content }} style={styles.image} />
        {renderReactList(item.reacts)}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    paddingVertical: 2,
    paddingHorizontal: 2,
    flex: 1,
    maxWidth: "75%",
    minWidth: "35%",
    position: "relative",
    marginBottom: 12,
  },
  bodyOfMyMessage: {
    marginLeft: "auto",
    flex: 1,
    maxWidth: "75%",
    minWidth: "35%",
    position: "relative",
    marginBottom: 12,
  },
  image: {
    height: 200,
    width: 250,
    resizeMode: "contain",
  },
});

export default ImageMessage;
