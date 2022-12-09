import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import * as Linking from "expo-linking";
import { Feather } from "@expo/vector-icons";
import { reactListStyles } from "./TextMessage";

const FileMessage = (props) => {
  const { item, isMyMessage, showModalReact } = props;
  function onLink() {
    Linking.openURL(item.content);
  }

  function renderFileName(content) {
    let newName = content.replace(
      /https:\/\/upload-gavroche-chat-app\.s3\.ap-southeast-1\.amazonaws.com\/gavroche-[0-9]*-/g,
      ""
    );
    return newName;
  }

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
    <View style={styles.container}>
      <TouchableOpacity
        onLongPress={() => showModalReact(item)}
        style={[isMyMessage ? styles.bodyOfMyMessage : styles.body]}
      >
        <View style={styles.file}>
          <Feather name="file-text" size={24} color="black" />
          <Text style={styles.link}>
            {renderFileName(item && item.content)}
          </Text>
          <Text style={styles.btnLink} onPress={onLink}>
            Mở
          </Text>
          {renderReactList(item.reacts)}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    width: "100%",
  },
  body: {
    paddingVertical: 2,
    paddingHorizontal: 2,
    flex: 1,
    marginRight: "auto",
  },
  bodyOfMyMessage: {
    marginLeft: "auto",
  },
  file: {
    flexDirection: "row",
    backgroundColor: "#b2c7d4",
    padding: 8,
    borderRadius: 4,
    position: "relative",
  },
  link: {
    color: "blue",
    marginRight: 4,
    paddingLeft: 4,
    fontSize: 14,
  },
  btnLink: {
    padding: 8,
    borderRadius: 4,
    fontWeight: "bold",
    color: "#1a69d9",
  },
});

export default FileMessage;
