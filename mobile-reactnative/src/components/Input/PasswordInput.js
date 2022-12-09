import React, { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";

const PasswordInput = ({ value, setValue, hint, style, isWrong }) => {
  const [isHidePwd, setIsHidePwd] = useState(true);
  const [isFocus, setisFocus] = useState(false);
  return (
    <View
      style={[
        styles.inputContainer,
        style,
        isFocus ? styles.inputContainerFocus : {},
        isWrong ? styles.inputWrong : {},
      ]}
    >
      <TextInput
        style={[styles.input]}
        value={value}
        onChangeText={setValue}
        placeholder={hint ? hint : "Mật khẩu"}
        secureTextEntry={isHidePwd}
        onChange={() => {
          setisFocus(true);
        }}
        onBlur={() => {
          setisFocus(false);
        }}
      />
      <Feather
        name={isHidePwd ? "eye-off" : "eye"}
        size={24}
        color="black"
        style={styles.icon}
        onPress={() => setIsHidePwd(!isHidePwd)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    color: "#495057",
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ced4da",
    backgroundColor: "#fff",
  },
  inputContainerFocus: {
    borderColor: "#66bcf8",
  },
  inputWrong: {
    borderColor: "red",
  },
  input: {
    flex: 1,
    fontSize: 17,
    paddingBottom: 2,
  },
});

export default PasswordInput;
