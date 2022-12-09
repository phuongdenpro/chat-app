import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";

export default function Login({ navigation }) {
  function onLogin() {
    navigation.navigate("LoginInput");
  }
  function onRegister() {
    navigation.navigate("RegisterPhoneInput");
  }

  return (
    <View style={styles.container}>
      <View style={styles.logContainer}>
        <Image
          source={require("../../../assets/logo.png")}
          style={styles.logo}
        />
      </View>
      <View style={styles.body}>
        <TouchableOpacity
          style={[styles.btn, styles.btnLogin]}
          onPress={onLogin}
        >
          <Text
            style={{
              textTransform: "uppercase",
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            Đăng nhập
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnRegister]}
          onPress={onRegister}
        >
          <Text
            style={{
              textTransform: "uppercase",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            Đăng Kí
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  body: {
    marginTop: "auto",
    marginBottom: "40%",
  },
  btn: {
    width: 250,
    borderRadius: 40,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    margin: 12,
  },
  btnLogin: {
    backgroundColor: "#0590f3",
  },
  btnRegister: {
    backgroundColor: "#eee",
  },
  logContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    height: 200,
    marginTop: 36,
  },

  logoWrap: {
    backgroundColor: "transparent",
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  logo: {
    width: 200,
    width: 200,
    resizeMode: "contain",
  },
});
