import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import userApi from "../../api/userApi";
import PasswordInput from "../../components/Input/PasswordInput";
import PhoneInput from "../../components/Input/PhoneInput";
import LoadingModal from "../../components/LoadingModal";
import Submit from "../../components/Login/Submit";
import { useGlobalContext } from "../../store/contexts/GlobalContext";

const ForgotPassword = ({ navigation, route }) => {
  const [pwdInput, setPwdInput] = useState("111111");
  const [confirmPwdInput, setConfirmPwdInput] = useState("111111");
  const [errText, setErrText] = useState("Nhập mật khẩu mới");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisSubmit, setIsDisSubmit] = useState(true);
  const [pwdTextWar, setPwdTextWar] = useState("");
  const [isWrongPwd, setisWrongPwd] = useState(false);
  const { login } = useGlobalContext();

  const [confPwdTextWar, setConfPwdTextWar] = useState("");
  const [isWrongConfPwd, setisWrongConfPwd] = useState(false);

  async function onSubmit() {
    if (!isDisSubmit) {
      if (validate()) {
        try {
          const user = await userApi.findUserByPhoneNumber(
            route.params.phoneInput
          );
          if (user.isSuccess && user._id) {
            const res = await userApi.updatePassword(user._id, pwdInput);
            if (res.isSuccess) {
              console.log("update pass ok");
              login(route.params.phoneInput, pwdInput);
            }
          }
        } catch (error) {}
      }
    }
  }

  useEffect(() => {
    setisWrongPwd(false);
    setPwdTextWar("");
    setisWrongConfPwd(false);
    setConfPwdTextWar("");

    if (pwdInput && confirmPwdInput) {
      setIsDisSubmit(false);
    } else {
      setIsDisSubmit(true);
    }

    return () => {};
  }, [pwdInput, confirmPwdInput]);

  function validate() {
    let is = true;

    if (pwdInput.trim() == "" || pwdInput.trim().length < 6) {
      setPwdTextWar("Mật khẩu phải từ 6-40 kí tự");
      setisWrongPwd(true);
      is = false;
    } else if (confirmPwdInput.trim() != pwdInput.trim()) {
      setConfPwdTextWar("Hai mật khẩu phải giống nhau");
      setisWrongConfPwd(true);
      is = false;
    }

    return is;
  }

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{errText}</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mật khẩu mới</Text>
        <PasswordInput
          value={pwdInput}
          setValue={setPwdInput}
          hint={"Nhập mật khẩu mới"}
          isWrong={isWrongPwd}
        />
        <Text style={styles.errText}>{pwdTextWar}</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nhập lại mật khẩu</Text>
        <PasswordInput
          value={confirmPwdInput}
          setValue={setConfirmPwdInput}
          hint={"Nhập lại mật khẩu"}
          isWrong={isWrongConfPwd}
        />
        <Text style={styles.errText}>{confPwdTextWar}</Text>
      </View>
      <View style={styles.btnContainer}>
        <Submit isDisSubmit={isDisSubmit} onSubmit={onSubmit} />
      </View>
      <LoadingModal visible={isLoading} text={"Đăng đăng nhập..."} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  textContainer: {
    backgroundColor: "#eee",
    padding: 12,
    width: "100%",
    alignItems: "center",
  },
  inputContainer: {
    height: 92,
    marginTop: 12,
    paddingHorizontal: 12,
  },
  text: {
    fontSize: 12,
    color: "red",
  },
  label: {
    fontSize: 18,
    paddingBottom: 8,
    color: "#1b1d1e",
  },
  btnContainer: {
    marginTop: "auto",
  },
  errText: {
    paddingTop: 6,
    color: "red",
  },
});

export default ForgotPassword;
