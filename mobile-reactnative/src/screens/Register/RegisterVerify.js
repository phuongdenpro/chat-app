import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner,
} from "expo-firebase-recaptcha";
import { initializeApp, getApp } from "firebase/app";
import {
  getAuth,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import LoadingModal from "../../components/LoadingModal";

try {
  initializeApp({
    apiKey: "AIzaSyDTitbaB9Uh920_HCBiSrJfWQr71_Yt570",
    authDomain: "gavroche-chat-auth.firebaseapp.com",
    projectId: "gavroche-chat-auth",
    storageBucket: "gavroche-chat-auth.appspot.com",
    messagingSenderId: "190776827437",
    appId: "1:190776827437:web:cdd475007e738bb03da2a4",
    measurementId: "G-VJK7FP2M06",
  });
} catch (err) {
  console.log(err);
}

const app = getApp();
const auth = getAuth(app);

const RegisterVerify = ({ navigation, route }) => {
  const recaptchaVerifier = useRef(null);
  const [verificationId, setVerificationId] = useState();
  const [otpInput, setOtpInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errText, setErrText] = useState("");

  useEffect(() => {
    if (otpInput.length == 6) {
      setIsLoading(true);
      confirmCode();
    }
    return () => {};
  }, [otpInput]);

  useEffect(() => {
    if (route && route.params.phoneInput) {
      sendVertification(route.params.phoneInput);
    }
    return () => {};
  }, []);

  function onReloadOpt() {
    setOtpInput("");
    sendVertification(route.params.phoneInput);
  }

  const firebaseConfig = app ? app.options : undefined;
  const attemptInvisibleVerification = false;

  const sendVertification = async (phoneInput) => {
    let phone = "+84" + phoneInput.slice(1, phoneInput.length).trim();
    console.log(phone);
    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phone,
        recaptchaVerifier.current
      );
      setVerificationId(verificationId);
    } catch (error) {
      navigation.navigate("RegisterPhoneInput", {
        err: "Số điện thoại không hợp lệ",
      });
    }
  };

  const confirmCode = async () => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otpInput);
      await signInWithCredential(auth, credential);
      setIsLoading(false);
      navigation.navigate(route.params.nextScreen, {
        phoneInput: route.params.phoneInput,
      });
    } catch (error) {
      setIsLoading(false);
      setErrText("Mã otp không hợp lệ!");
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.errText}>{errText}</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>NHẬP MÃ OTP </Text>
        <TextInput
          style={styles.input}
          value={otpInput}
          keyboardType={"number-pad"}
          onChangeText={setOtpInput}
          placeholder={"______"}
        />
        <TouchableOpacity onPress={onReloadOpt}>
          <AntDesign name="reload1" size={24} color="#1a69d9" />
        </TouchableOpacity>
      </View>

      <LoadingModal visible={isLoading} text={"Đang kiểm tra..."} />

      {/* firebase */}

      <View style={styles.capcharContainer}>
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={app.options}
          //attemptInvisibleVerification
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  errText: {
    padding: 8,
    color: "red",
    textAlign: "center",
    backgroundColor: "#eee",
    fontSize: 15,
  },
  inputContainer: {
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    padding: 12,
    backgroundColor: "#ddd",
    borderRadius: 4,
    width: 160,
    fontSize: 18,
    marginLeft: 12,
    letterSpacing: 12,
    marginRight: 24,
  },
  btnSubmit: {},
  btnText: {},
  capcharContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RegisterVerify;
