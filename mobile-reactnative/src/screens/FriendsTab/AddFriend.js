import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import userApi from "../../api/userApi";
import PhoneInput from "../../components/Input/PhoneInput";
import { useFriendContext } from "../../store/contexts/FriendContext";
import AddFriendItem from "./components/AddFriendItem";

const AddFriend = () => {
  const [phoneInput, setphoneInput] = useState("0356267135");
  const [userFound, setuserFound] = useState(null);
  const [errText, setErrText] = useState("");
  const [isDisSubmit, setIsDisSubmit] = useState(false);
  const { findUserByPhoneNumber, friends } = useFriendContext();

  useEffect(() => {
    if (phoneInput.length == 10) {
      setIsDisSubmit(false);
      onFindSubmit();
    } else {
      setuserFound(null);
      setIsDisSubmit(true);
    }

    return () => {};
  }, [phoneInput]);

  async function onFindSubmit() {
    if (phoneInput.length != 10) return;
    let res = await findUserByPhoneNumber(phoneInput);
    if (res && res.isSuccess && res._id) {
      setuserFound(res);
      setErrText("");
    } else {
      setErrText("Số điện thoại này có vẻ chưa đăng kí tài khoản nào");
    }
  }

  useEffect(() => {
    onFindSubmit();
    return () => {};
  }, [friends]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Thêm bạn bằng số điện thoại</Text>
      <View style={styles.inputGroup}>
        <View style={styles.input}>
          <PhoneInput phoneInput={phoneInput} setPhoneInput={setphoneInput} />
        </View>
        <TouchableOpacity style={styles.btnContainer}>
          <Text
            onPress={onFindSubmit}
            style={[styles.btnText, isDisSubmit ? styles.btnTextDisable : {}]}
          >
            Tìm
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        {userFound ? (
          <AddFriendItem {...userFound} />
        ) : (
          <View style={styles.notFound}>
            <Text style={styles.notFoundText}>{errText}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerTitle: {
    padding: 8,
    marginBottom: 12,
    textAlign: "center",
    color: "#333",
    backgroundColor: "#eee",
  },
  inputGroup: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  input: {
    flex: 1,
  },
  btnContainer: {
    marginLeft: 8,
    justifyContent: "center",
  },
  btnText: {
    borderRadius: 4,
    backgroundColor: "#1a69d9",
    paddingVertical: 12,
    paddingHorizontal: 12,
    color: "white",
  },
  btnTextDisable: {
    opacity: 0.6,
  },

  body: {
    paddingVertical: 4,
    backgroundColor: "#eee",
    flex: 1,
  },
  notFoundText: {
    padding: 12,
  },
});

export default AddFriend;
