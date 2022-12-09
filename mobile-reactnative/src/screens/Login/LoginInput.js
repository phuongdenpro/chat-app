import React, { useRef } from "react";
import { useState, useEffect } from "react";
const axios = require("axios").default;
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { EvilIcons, AntDesign } from "@expo/vector-icons";
import Submit from "../../components/Login/Submit";
import PhoneInput from "../../components/Input/PhoneInput";
import PasswordInput from "../../components/Input/PasswordInput";
import authApi from "../../api/authApi";
import { useGlobalContext } from "../../store/contexts/GlobalContext";
import LoadingModal from "../../components/LoadingModal";
export default function LoginInput({ navigation }) {
  const { onLoginSuccess } = useGlobalContext();
  const [phoneInput, setPhoneInput] = useState("0868283915");
  const [pwdInput, setPwdInput] = useState("111111");
  const [isDisSubmit, setIsDisSubmit] = useState(true);
  const [isLoading, setisLoading] = useState(false);
  const [textErrRes, settextErrRes] = useState("");

  useEffect(() => {
    // enable submit login when user type done

    // if (validate()) {
    if (true) {
      setIsDisSubmit(false);
    } else {
      setIsDisSubmit(true);
    }
    return () => {};
  }, [phoneInput, pwdInput]);

  function validate() {
    let isCheck = true;
    let vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;

    if (!vnf_regex.test(phoneInput)) {
      isCheck = false;
    }
    if (pwdInput.trim() == "") {
      isCheck = false;
    }

    return isCheck;
  }

  async function onSubmit() {
    settextErrRes("");
    try {
      setisLoading(true);
      const res = await authApi.login(phoneInput, pwdInput);
      setisLoading(false);
      if (res.isSuccess) {
        onLoginSuccess(res);
      } else {
        settextErrRes("Tài khoản hoặc mật khẩu không chính xác");
      }
    } catch (error) {
      settextErrRes("Tài khoản hoặc mật khẩu không chính xác");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{textErrRes}</Text>
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Số điện thoại</Text>
          <PhoneInput phoneInput={phoneInput} setPhoneInput={setPhoneInput} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mật khẩu</Text>
          <PasswordInput value={pwdInput} setValue={setPwdInput} />
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ForgotPasswordPhoneInput");
          }}
        >
          <Text style={styles.textGetPwd}>Lấy lại mật khẩu</Text>
        </TouchableOpacity>
      </View>
      <Submit isDisSubmit={isDisSubmit} onSubmit={onSubmit} />
      <LoadingModal visible={isLoading} text={"Đăng đăng nhập..."} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  bodyContainer: {
    marginHorizontal: 16,
    flex: 1,
    paddingTop: 12,
  },
  textContainer: {
    backgroundColor: "#eee",
    padding: 12,
    width: "100%",
    alignItems: "center",
  },
  inputContainer: {
    height: 92,
  },
  text: {
    fontSize: 12,
    color: "red",
  },

  input: {
    flex: 1,
    fontSize: 16,
    paddingBottom: 2,
  },
  phone: {},
  password: {
    marginTop: 16,
  },
  icon: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  warnText: {
    paddingVertical: 10,
    color: "red",
  },
  textGetPwd: {
    fontWeight: "bold",
    paddingVertical: 8,
    marginVertical: 8,
    fontSize: 16,
    color: "#4aabf0",
  },
  label: {
    fontSize: 18,
    paddingBottom: 8,
    color: "#1b1d1e",
  },
  errText: {
    // paddingTop: 6,
    color: "red",
  },
});
