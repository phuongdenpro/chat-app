import React, { isValidElement, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import AddFriendItem from "../FriendsTab/components/AddFriendItem";
import { useConversationContext } from "../../store/contexts/ConversationContext";
import { useFriendContext } from "../../store/contexts/FriendContext";
import AddGroupItem from "../FriendsTab/components/AddGroupItem";
import LoadingModal from "../../components/LoadingModal";
const ListMember = (props) => {
  const { navigation, route } = props;
  const { getMembers, addMembers, convers } = useConversationContext();
  const { friends, findUserByPhoneNumber } = useFriendContext();
  const [members, setMembers] = useState(getMembers(route.params.converId));
  const [selectedId, setSelectedId] = useState(null);
  const [isShowAddMember, setIsShowAddMember] = useState(false);
  const [listMembers, setListMembers] = useState([]);
  const [phoneInput, setphoneInput] = useState("0988888881");
  const [userFound, setuserFound] = useState(null);

  const [isFinding, setIsFinding] = useState(true);
  const [findErrText, setFindErrText] = useState("Không tìm thấy");
  const [isAdding, setisAdding] = useState(false);

  // useEffect
  useEffect(() => {
    setMembers(getMembers(route.params.converId));
    return () => {};
  }, [convers]);

  function renderItem({ item }) {
    return (
      <AddFriendItem
        {...item}
        converId={route.params.converId}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />
    );
  }

  // handle when show add friend view
  function renderAddFriend() {
    return (
      <View style={styles.addFriendContainer}>
        <Text style={styles.addFriendTitle}>Chọn người để thêm vào nhóm</Text>
        <View style={styles.search}>
          <AntDesign name="search1" size={24} color="black" />
          <TextInput
            style={styles.searchInput}
            value={phoneInput}
            onChangeText={setphoneInput}
            placeholder={"Nhập số điện thoại cần tìm"}
            keyboardType={"numeric"}
          />
          {isFinding && <ActivityIndicator size="small" color={"#0000ff"} />}
        </View>
        <Text style={styles.numOfSelected}>Đã chọn {listMembers.length}</Text>
        <View style={styles.list}>
          <Text style={styles.textFindErr}>{findErrText}</Text>
          <FlatList
            data={userFound ? [userFound] : friends}
            renderItem={renderItemAddFriend}
            keyExtractor={(item) => item._id}
          />
        </View>
        {listMembers.length > 0 ? (
          <Pressable
            style={styles.btnSubmitAddContainer}
            onPress={onAddMembers}
          >
            {isAdding ? (
              <ActivityIndicator size="small" color={"#0000ff"} />
            ) : (
              <Text style={styles.btnSubmitAdd}>
                Thêm {listMembers.length} thành viên vào nhóm
              </Text>
            )}
          </Pressable>
        ) : (
          <Text
            style={[styles.btnSubmitAdd, styles.bntSubmitClose]}
            onPress={() => {
              setIsShowAddMember(false);
            }}
          >
            Đóng
          </Text>
        )}
      </View>
    );
  }

  // click add member
  async function onAddMembers() {
    setisAdding(true);
    let _members = await addMembers(route.params.converId, listMembers);
    setisAdding(false);
    setIsShowAddMember(false);
  }

  useEffect(() => {
    if (phoneInput && phoneInput.length == 10) {
      findUser();
    } else {
      setuserFound(null);
      setFindErrText("");
    }
    return () => {};
  }, [phoneInput]);

  function renderItemAddFriend({ item }) {
    return (
      <AddGroupItem
        {...item}
        pushMember={pushMember}
        removeMember={removeMember}
        checkIsExistsInGroup={checkIsExistsInGroup}
      />
    );
  }

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
    setIsFinding(true);
    setFindErrText("");

    let res = await findUserByPhoneNumber(phoneInput);
    setIsFinding(false);
    if (res && res.isSuccess && res._id) {
      setuserFound(res);
    } else {
      console.log("not found");
      setFindErrText("Tài khoản không tồn tại");
    }
  }

  // kiểm tra xem đã có trong nhóm hay chưa
  function checkIsExistsInGroup(_id) {
    let _members = [...members];
    for (let i = 0; i < _members.length; i++) {
      if (_members[i]._id == _id) {
        return true;
      }
    }
    return false;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {isShowAddMember ? (
          renderAddFriend()
        ) : (
          <TouchableOpacity
            onPress={() => {
              setIsShowAddMember(true);
            }}
            style={styles.btn}
          >
            <AntDesign name="adduser" size={24} color="black" />
            <Text style={styles.textBtn}>Thêm thành viên</Text>
          </TouchableOpacity>
        )}
        <View style={styles.section}>
          <Text style={styles.text}>
            Danh sách thành viên ({members && members.length})
          </Text>
        </View>
      </View>
      <View style={styles.body}>
        <FlatList
          data={members}
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
    paddingVertical: 8,
  },
  btn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ddd",
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 12,
  },
  textBtn: {
    marginLeft: 8,
  },
  section: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#eee",
  },
  text: {
    fontWeight: "bold",
  },

  addFriendContainer: {},
  addFriendTitle: {
    paddingLeft: 12,
    fontWeight: "bold",
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
  textFindErr: {
    paddingLeft: 12,
    color: "red",
  },
  btnSubmitAddContainer: {
    paddingVertical: 8,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a69d9",
    marginHorizontal: 12,
    borderRadius: 4,
  },
  btnSubmitAdd: {
    color: "white",
    textAlign: "center",
  },
  bntSubmitClose: {
    backgroundColor: "#eb6152",
    color: "white",
    paddingVertical: 8,
    marginVertical: 8,
    marginHorizontal: 12,
    borderRadius: 4,
  },
});

export default ListMember;
