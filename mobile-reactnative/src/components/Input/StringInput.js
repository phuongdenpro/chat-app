import React, { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";

const StringInput = ({ value, setValue, style, hint, isWrong }) => {
  const [isFocus, setisFocus] = useState(false);
  return (
    <View style={style}>
      <View
        style={[
          styles.inputContainer,
          isWrong ? styles.inputWrong : {},
          isFocus ? styles.inputContainerFocus : {},
        ]}
      >
        <TextInput
          value={value}
          onChangeText={setValue}
          style={styles.input}
          placeholder={hint}
          onChange={() => {
            setisFocus(true);
          }}
          onBlur={() => {
            setisFocus(false);
          }}
        />
      </View>
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

export default StringInput;
