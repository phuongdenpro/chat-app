import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Image,
  Pressable,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import AddGroupItem from "./components/AddGroupItem";
import * as ImagePicker from "expo-image-picker";
import { HeaderBackButton } from "@react-navigation/stack";
import Friends from "./Friends";
import { useFriendContext } from "../../store/contexts/FriendContext";
import converApi from "../../api/converApi";
import { useConversationContext } from "../../store/contexts/ConversationContext";

const AddGroupChat = (props) => {
  const { navigation, route } = props;
  const { friends, findUserByPhoneNumber } = useFriendContext();
  const { addNewConver } = useConversationContext();
  const [userFound, setuserFound] = useState(null);

  const [isSubmitActive, setisSubmitActive] = useState(false);
  const [image, setImage] = useState(null);
  const [nameInput, setnameInput] = useState("");
  const [listMembers, setListMembers] = useState([]);
  const [phoneInput, setphoneInput] = useState("0988888881");

  async function onPickImage() {
    console.log("pick");
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result);
    }
  }

  useEffect(() => {
    if (nameInput && listMembers.length > 0) {
      setisSubmitActive(true);
    } else {
      setisSubmitActive(false);
    }
    return () => {};
  }, [nameInput, listMembers]);

  function renderItem({ item }) {
    return (
      <AddGroupItem
        {...item}
        pushMember={pushMember}
        removeMember={removeMember}
      />
    );
  }

  useEffect(() => {
    if (phoneInput && phoneInput.length == 10) {
      findUser();
    } else {
      setuserFound(null);
    }
    return () => {};
  }, [phoneInput]);

  function pushMember(_id) {
    let arr = [...listMembers];

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == _id) {
        return;
      }
    }

    arr.push(_id);
    setListMembers(arr);
  }

  function removeMember(_id) {
    let arr = [...listMembers];
    let index = arr.indexOf(_id);

    if (index >= 0) arr.splice(index, 1);
    setListMembers(arr);
  }

  async function findUser() {
    if (phoneInput.length != 10) return;
    let res = await findUserByPhoneNumber(phoneInput);
    if (res && res.isSuccess && res._id) {
      setuserFound(res);
    } else {
      console.log("not found");
      // setErrText("Số điện thoại này có vẻ chưa đăng kí tài khoản nào");
    }
  }

  async function onCreateGroup() {
    const body = {
      name: nameInput,
      userIds: [...listMembers],
    };
    if (listMembers.length < 2) {
      Alert.alert("Tạo nhóm cần ít nhất 3 thành viên");
      return;
    }
    const res = await converApi.createGroupChat(body);
    if (res.isSuccess) {
      console.log("create group chat ok");
      addNewConver(res);
      navigation.navigate("MessageTab", {
        screen: "ListChat",
        params: {
          screen: "ChatRoom",
          params: {
            converId: res._id,
          },
        },
      });
    } else {
      console.log("create group chat error");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          value={nameInput}
          onChangeText={setnameInput}
          style={styles.nameInput}
          placeholder={"Đặt tên nhóm"}
        />
        <Text
          style={[styles.btnSubmit, isSubmitActive && styles.btnSubmitActive]}
          onPress={onCreateGroup}
        >
          Tạo nhóm
        </Text>
      </View>
      <View style={styles.search}>
        <AntDesign name="search1" size={24} color="black" />
        <TextInput
          style={styles.searchInput}
          value={phoneInput}
          onChangeText={setphoneInput}
          placeholder={"Nhập số điện thoại cần tìm"}
          keyboardType={"numeric"}
        />
      </View>
      <Text style={styles.numOfSelected}>Đã chọn {listMembers.length}</Text>
      <View style={styles.list}>
        <FlatList
          data={userFound ? [userFound] : friends}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  image: {
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
    borderRadius: 50,
  },
  nameInput: {
    padding: 12,
    fontSize: 15,
    flex: 1,
  },
  btnSubmit: {
    marginRight: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#eee",
    borderRadius: 20,
  },

  btnSubmitActive: {
    backgroundColor: "#1a69d9",
    color: "white",
  },
  search: {
    flexDirection: "row",
    backgroundColor: "#eee",
    marginHorizontal: 12,
    marginTop: 8,
    padding: 8,
    borderRadius: 12,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    paddingLeft: 12,
    fontSize: 15,
  },
  numOfSelected: {
    padding: 12,
    fontSize: 15,
    fontWeight: "bold",
    borderBottomWidth: 4,
    borderBottomColor: "#eee",
  },
  list: {},
});

export default AddGroupChat;
