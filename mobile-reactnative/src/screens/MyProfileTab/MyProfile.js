import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Image,
  Modal,
  TouchableOpacityBase,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import MyProfileModal from "./MyProfileModal";
import { useGlobalContext } from "../../store/contexts/GlobalContext";
import userApi from "../../api/userApi";

const MyProfile = (props) => {
  const { navigation, route } = props;
  const [isModalShow, setIsModalShow] = useState(false);
  const { user } = useGlobalContext();
  const { modalProfile, setModalProfile } = useGlobalContext();

  function logoutPress() {
    setIsModalShow(true);
  }

  async function onDetailProfilePress() {
    let acc = await userApi.findUserById(user._id);
    if (acc.isSuccess) {
      setModalProfile({
        acc: acc,
        isShow: true,
      });
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onDetailProfilePress}
        activeOpacity={0.7}
        style={[styles.item, styles.borderBottom]}
      >
        <View style={styles.left}>
          {user && user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <Image
              source={require("../../../assets/avatar.jpg")}
              style={styles.avatar}
            />
          )}
        </View>
        <View style={styles.body}>
          <Text style={styles.title}>{user.name}</Text>
          <Text style={styles.description}>Xem trang cá nhân</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.7} style={styles.item}>
        <View style={styles.left}>
          <Ionicons name="wallet-outline" size={24} color="black" />
        </View>
        <View style={styles.body}>
          <Text style={styles.title}>Ví QR</Text>
          <Text style={styles.description}>
            Lưu trữ và xuất trình các mã QR quan trọng
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.7} style={styles.item}>
        <View style={styles.left}>
          <MaterialIcons name="security" size={24} color="black" />
        </View>
        <View style={styles.body}>
          <Text style={styles.title}>Tài khoản và bảo mật</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.item}
        onPress={logoutPress}
      >
        <View style={styles.left}>
          <MaterialIcons name="logout" size={24} color="red" />
        </View>
        <View style={styles.body}>
          <Text style={[styles.title, styles.logoutTitle]}>Đăng xuất</Text>
        </View>
      </TouchableOpacity>
      <MyProfileModal
        isModalShow={isModalShow}
        setIsModalShow={setIsModalShow}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f2f2",
  },
  item: {
    paddingHorizontal: 14,
    backgroundColor: "white",
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#f2f2f2",
  },
  left: {
    paddingRight: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  body: {
    flex: 2,
  },

  title: {
    fontWeight: "bold",
    fontSize: 17,
  },
  description: {
    fontSize: 15,
    color: "#888",
    paddingVertical: 4,
  },
  borderBottom: {
    borderBottomWidth: 8,
  },
  logoutTitle: {
    color: "red",
  },
});

export default MyProfile;
