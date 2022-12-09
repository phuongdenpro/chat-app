import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Image,
  TextInput,
  Text,
  ActivityIndicator,
  Button,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import {
  FontAwesome5,
  Feather,
  MaterialIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { useGlobalContext } from "../store/contexts/GlobalContext";
import { AntDesign } from "@expo/vector-icons";
import { converDate } from "../utils";
import { useConversationContext } from "../store/contexts/ConversationContext";
import { useFriendContext } from "../store/contexts/FriendContext";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";

const ProfileModal = () => {
  const { modalProfile, setModalProfile, user, updateInfor, updateAvatar } =
    useGlobalContext();
  const {
    checkIsMyFriend,
    checkIsRequested,
    checkIsRequestedToMe,
    deleteRequestFriend,
    sendRequestFriend,
    acceptFriend,
    refuseFriend,
  } = useFriendContext();

  const { acc, isShow } = modalProfile;
  const [inforInput, setInforInput] = useState({});
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

  const [isEditName, setIsEditName] = useState(false);

  useEffect(() => {
    if (modalProfile && modalProfile.acc) {
      setInforInput({
        ...inforInput,
        name: modalProfile.acc.name,
      });
    }
    return () => {};
  }, [modalProfile]);

  // pick and change avatar
  async function onChangeAvatar() {
    console.log("pick");
    console.log("pick image");
    let result = await ImagePicker.launchImageLibraryAsync();
    if (!result.cancelled) {
      setIsUpdatingAvatar(true);
      let is = await updateAvatar(result);
      setIsUpdatingAvatar(false);
    }
  }

  async function onSaveChange() {
    setIsEditName(false);
    let is = await updateInfor(inforInput);
  }

  function renderBtns() {
    if (acc && checkIsMyFriend(acc._id)) {
      return null;
    } else if (checkIsRequested(acc._id)) {
      return (
        <Text
          style={[styles.btn, { color: "red" }]}
          onPress={() => deleteRequestFriend(acc._id)}
        >
          Thu hồi yêu cầu kết bạn
        </Text>
      );
    } else if (checkIsRequestedToMe(acc._id)) {
      return (
        <>
          <Text
            style={[styles.btn, styles.btnAcceptFriend]}
            onPress={() => acceptFriend(acc._id)}
          >
            Đồng ý
          </Text>
          <Text
            style={[styles.btn, { color: "red" }]}
            onPress={() => refuseFriend(acc._id)}
          >
            Từ chối
          </Text>
        </>
      );
    } else {
      return (
        <Text style={styles.btn} onPress={() => sendRequestFriend(acc._id)}>
          Kết bạn
        </Text>
      );
    }
  }

  // date picker
  const [selectedDate, setSelectedDate] = useState(
    (acc && acc.dateOfBirth) || ""
  );
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    setSelectedDate(acc && acc.dateOfBirth);
    return () => {};
  }, [acc]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    if (date >= new Date()) {
      hideDatePicker();
      return;
    }

    updateInfor({
      dateOfBirth: date,
    });
    setSelectedDate(date);
    hideDatePicker();
  };

  if (!acc) return null;

  return (
    <Modal visible={modalProfile.isShow} transparent={true}>
      <View style={styles.wrap}>
        <View style={styles.container}>
          <View style={styles.header}>
            {acc && acc._id == user._id ? (
              <Text style={styles.bodyTitle}>Thông tin tài khoản của bạn</Text>
            ) : (
              <Text style={styles.title}>Thông tin tài khoản</Text>
            )}
            <AntDesign
              name="close"
              size={24}
              color="black"
              onPress={() => {
                setIsEditName(false);
                setModalProfile({
                  acc: null,
                  isShow: false,
                });
              }}
            />
          </View>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarWraper}>
              {acc && modalProfile.acc.avatar ? (
                <Image
                  source={{ uri: modalProfile.acc.avatar }}
                  style={styles.avatar}
                />
              ) : (
                <Image
                  source={require("../../assets/avatar.jpg")}
                  style={styles.avatar}
                />
              )}
              {isUpdatingAvatar && (
                <ActivityIndicator style={styles.spiner} size="large" />
              )}

              {acc && acc._id == user._id && (
                <Feather
                  style={styles.cameraIcon}
                  name="camera"
                  size={24}
                  color="black"
                  onPress={onChangeAvatar}
                />
              )}
            </View>
          </View>
          <View style={styles.nameContainer}>
            {isEditName ? (
              <>
                <TextInput
                  style={styles.input}
                  value={inforInput && inforInput.name}
                  onChangeText={(text) => {
                    setInforInput({
                      ...inforInput,
                      name: text,
                    });
                  }}
                />
                <View style={styles.btnSaveNameContainer}>
                  <Text style={styles.btnSaveName} onPress={onSaveChange}>
                    Lưu
                  </Text>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.name}>{acc && modalProfile.acc.name}</Text>
                {acc && modalProfile.acc._id == user._id && (
                  <Text onPress={() => setIsEditName(true)}>
                    <FontAwesome5 name="pencil-alt" size={20} color="black" />
                  </Text>
                )}
              </>
            )}
          </View>
          {acc && acc._id != user._id && (
            <View style={styles.btns}>{renderBtns()}</View>
          )}
          <View style={styles.body}>
            <View style={styles.bodyItem}>
              <Text style={styles.bodyTitle}>Thông tin cá nhân</Text>
            </View>
            <View style={styles.bodyItem}>
              <Text style={styles.bodyLabel}>Giới tính</Text>
              <Text style={styles.bodyValue}>
                {acc && modalProfile.acc.gender ? "Nam" : "Nữ"}
              </Text>
              {acc && acc._id == user._id && (
                <TouchableOpacity
                  onPress={async () => {
                    let is = await updateInfor({
                      gender: !acc.gender,
                    });
                  }}
                >
                  <FontAwesome
                    style={styles.genderChange}
                    name="exchange"
                    size={22}
                    color="black"
                  />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.bodyItem}>
              <Text style={styles.bodyLabel}>Ngày sinh</Text>
              {/* // date picker */}

              <Text style={styles.dateValue}>
                {selectedDate
                  ? moment(selectedDate).format("DD/MM/YYYY")
                  : "././."}
              </Text>
              {acc && acc._id == user._id && (
                <MaterialIcons
                  name="date-range"
                  size={24}
                  color="black"
                  onPress={showDatePicker}
                />
              )}
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  wrap: {
    height: "100%",
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  container: {
    width: "85%",
    height: "80%",
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 12,
    borderBottomWidth: 4,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  avatarContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  avatarWraper: {
    position: "relative",
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  spiner: {
    position: "absolute",
    top: 50,
    left: 50,
  },
  cameraIcon: {
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  name: {
    paddingRight: 12,
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#ddd",
    flex: 1,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  btnSaveNameContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  btnSaveName: {
    backgroundColor: "#1a69d9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    color: "white",
  },
  btns: {
    flexDirection: "row",
  },
  btn: {
    paddingVertical: 8,
    flex: 1,
    textAlign: "center",
    backgroundColor: "#ddd",
    marginHorizontal: 8,
    borderRadius: 4,
  },
  btnAcceptFriend: {
    backgroundColor: "#1a69d9",
    color: "white",
  },
  body: {
    paddingVertical: 12,
  },
  bodyTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  bodyItem: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  bodyLabel: {
    width: 100,
    color: "#555",
  },
  bodyValue: {},
  genderChange: {
    paddingLeft: 12,
  },
  datePickerStyle: {
    width: 200,
    marginTop: 20,
  },
  dateValue: {
    paddingRight: 12,
  },
});

export default ProfileModal;
