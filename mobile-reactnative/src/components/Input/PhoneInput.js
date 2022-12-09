import React, { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { EvilIcons } from "@expo/vector-icons";

const PhoneInput = ({ phoneInput, setPhoneInput, style, isWrong }) => {
  const [isFocus, setisFocus] = useState(false);
  return (
    <View
      style={[
        styles.inputContainer,
        style,
        isWrong ? styles.inputWrong : {},
        isFocus ? styles.inputContainerFocus : {},
      ]}
    >
      <TextInput
        value={phoneInput}
        onChangeText={setPhoneInput}
        autoCompleteType="tel"
        keyboardType="number-pad"
        textContentType="telephoneNumber"
        style={[styles.input]}
        placeholder="Số điện thoại"
        onChange={() => {
          setisFocus(true);
        }}
        onBlur={() => {
          setisFocus(false);
        }}
      />
      {phoneInput && (
        <EvilIcons
          name="close"
          size={28}
          color="black"
          style={styles.icon}
          onPress={() => setPhoneInput("")}
        />
      )}
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
    fontSize: 16,
    paddingBottom: 2,
    fontSize: 17,
  },
});

export default PhoneInput;
