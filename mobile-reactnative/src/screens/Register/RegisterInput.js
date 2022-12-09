import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import PasswordInput from "../../components/Input/PasswordInput";
import PhoneInput from "../../components/Input/PhoneInput";
import Submit from "../../components/Login/Submit";
import StringInput from "../../components/Input/StringInput";
import authApi from "../../api/authApi";
import LoadingModal from "../../components/LoadingModal";
import { useGlobalContext } from "../../store/contexts/GlobalContext";

const RegisterInput = ({ navigation, route }) => {
  const [pwdInput, setPwdInput] = useState("1234567");
  const [nameInput, setnameInput] = useState("Cong Van Hoang");
  const [isDisSubmit, setIsDisSubmit] = useState(false);
  const [isWrongPhone, setisWrongPhone] = useState(false);
  const [isWrongName, setisWrongName] = useState(false);
  const [isWrongPwd, setisWrongPwd] = useState(false);
  const [phoneTextWar, setPhoneTextWar] = useState("");
  const [pwdTextWar, setPwdTextWar] = useState("");
  const [nameTextWar, setnameTextWar] = useState("");
  const [textErrRes, settextErrRes] = useState("");
  const [isLoadingModal, setisLoadingModal] = useState(false);
  const { onLoginSuccess } = useGlobalContext();
  const [modalLoadingText, setmodalLoadingText] = useState("Đang đăng kí...");

  async function onSubmit() {
    settextErrRes("");
    if (validate()) {
      setisLoadingModal(true);
      const res = await authApi.register({
        name: nameInput,
        phoneNumber: route.params.phoneInput,
        password: pwdInput,
      });
      if (!res.isSuccess) {
        setisLoadingModal(false);
        settextErrRes("Tài khoản đã tồn tại");
      } else {
        setmodalLoadingText("Đang đăng nhập...");
        const r2 = await authApi.login(route.params.phoneInput, pwdInput);
        setisLoadingModal(false);
        onLoginSuccess(r2);
      }
    }
  }

  useEffect(() => {
    setisWrongName(false);
    setnameTextWar("");

    return () => {};
  }, [nameInput]);

  useEffect(() => {
    setisWrongPwd(false);
    setPwdTextWar("");

    return () => {};
  }, [pwdInput]);

  function validate() {
    let is = true;

    if (
      nameInput.trim() == "" ||
      nameInput.trim().length < 4 ||
      nameInput.trim().length > 40
    ) {
      setnameTextWar("Tên không hợp lệ, từ 4-40 kí tự");
      setisWrongName(true);
      is = false;
    }

    if (pwdInput.trim() == "" || pwdInput.trim().length < 6) {
      setPwdTextWar("Mật khẩu phải từ 6-40 kí tự");
      setisWrongPwd(true);
      is = false;
    }

    return is;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.textErrRes}>{textErrRes}</Text>
      <View style={styles.body}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Họ và tên</Text>
          <StringInput
            isWrong={isWrongName}
            value={nameInput}
            setValue={setnameInput}
            hint={"Họ và tên"}
          />

          <Text style={styles.errText}>{nameTextWar}</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mật khẩu</Text>
          <PasswordInput
            isWrong={isWrongPwd}
            value={pwdInput}
            setValue={setPwdInput}
          />
          <Text style={styles.errText}>{pwdTextWar}</Text>
        </View>
      </View>
      <Submit isDisSubmit={isDisSubmit} onSubmit={onSubmit} />
      <LoadingModal visible={isLoadingModal} text={modalLoadingText} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  textErrRes: {
    padding: 8,
    color: "red",
    textAlign: "center",
    backgroundColor: "#eee",
    fontSize: 15,
  },
  body: {
    paddingHorizontal: 12,
    flex: 1,
  },

  label: {
    fontSize: 18,
    marginTop: 8,
    paddingBottom: 8,
    color: "#1b1d1e",
  },
  errText: {
    paddingTop: 6,
    color: "red",
  },
  touch: {
    backgroundColor: "skyblue",
  },
});

export default RegisterInput;
