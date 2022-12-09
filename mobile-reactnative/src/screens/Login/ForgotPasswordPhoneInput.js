import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import userApi from "../../api/userApi";
import PhoneInput from "../../components/Input/PhoneInput";
import LoadingModal from "../../components/LoadingModal";
import Submit from "../../components/Login/Submit";

const ForgotPasswordPhoneInput = ({ navigation, route }) => {
  const [phoneInput, setPhoneInput] = useState("0356267135");
  const [errText, setErrText] = useState(
    "Nhập số điện thoại tài khoản của bạn"
  );
  const [isDisSubmit, setIsDisSubmit] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit() {
    if (validate()) {
      setIsLoading(true);
      let res = await userApi.findUserByPhoneNumber(phoneInput);

      setIsLoading(false);
      if (res.isSuccess && res._id) {
        navigation.navigate("RegisterVerify", {
          phoneInput,
          nextScreen: "ForgotPassword",
        });
      } else {
        setErrText("Số điện thoại chưa có tài khoản");
      }
    }
  }

  useEffect(() => {
    if (route && route.params && route.params.err) {
      setErrText(route.params.err);
    }
    return () => {};
  }, [route]);

  useEffect(() => {
    if (phoneInput.length == 10) {
      setIsDisSubmit(false);
    } else {
      setIsDisSubmit(true);
    }
    return () => {};
  }, [phoneInput]);

  function validate() {
    let vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    let is = true;
    if (!vnf_regex.test(phoneInput.trim())) {
      is = false;
    }
    return is;
  }
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{errText}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Số điện thoại</Text>
          <PhoneInput phoneInput={phoneInput} setPhoneInput={setPhoneInput} />
        </View>
      </View>
      <View style={styles.btnContainer}>
        <Submit isDisSubmit={isDisSubmit} onSubmit={onSubmit} />
      </View>
      <LoadingModal visible={isLoading} text={"Kiểm tra số điện thoại..."} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  body: {
    paddingHorizontal: 12,
    paddingVertical: 12,
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
  label: {
    fontSize: 18,
    paddingBottom: 8,
    color: "#1b1d1e",
  },
  btnContainer: {
    marginTop: "auto",
  },
});

export default ForgotPasswordPhoneInput;
