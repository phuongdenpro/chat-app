import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const Submit = ({ isDisSubmit, onSubmit, style }) => {
  return (
    <View style={style}>
      <TouchableOpacity
        style={[styles.btnSubmit, isDisSubmit ? { opacity: 0.6 } : {}]}
        disabled={isDisSubmit}
        onPress={onSubmit}
      >
        <AntDesign
          name="right"
          size={28}
          color="white"
          style={styles.btnSubmitIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  btnSubmit: {
    marginLeft: "auto",
    marginRight: 16,
    backgroundColor: "#0590f3",
    padding: 16,
    borderRadius: 50,
    marginBottom: 18,
  },
  btnSubmitIcon: {},
});

export default Submit;
