import axiosClient from "./axiosClient";

class ConverApi {
  getAllConvers() {
    let url = "conversation/";
    return axiosClient.get(url);
  }

  createGroupChat(body) {
    let url = "conversation/groups";
    return axiosClient.post(url, body);
  }

  createSimpleChat(body) {
    let url = "conversation/";
    return axiosClient.post(url, body);
  }

  recallMessage(_id, converId) {
    let url = "message/" + _id;
    return axiosClient.delete(url);
  }

  recallMessageOnly(_id, converId) {
    let url = "message/" + _id + "/only";
    return axiosClient.delete(url);
  }

  getAllMessageByConverId(_id) {
    let url = "message/by_conversation/" + _id;
    return axiosClient.get(url);
  }

  // rời nhóm
  leaveGroup(converId) {
    let url = `conversation/${converId}/members/leave`;
    console.log(url);
    return axiosClient.delete(url);
  }

  // đuổi khỏi nhóm
  deleteMember(converId, memberId) {
    let url = `conversation/${converId}/members/${memberId}`;
    return axiosClient.delete(url);
  }

  // cho làm phó nhóm
  addManager(converId, memberId) {
    let url = `conversation/${converId}/managers`;
    console.log(converId, memberId);
    return axiosClient.post(url, {
      managerId: [memberId],
    });
  }

  // không cho làm phó nhóm nữa
  deleteManager(converId, memberId) {
    let url = `conversation/${converId}/managers/leave`;
    return axiosClient.post(url, {
      managerId: [memberId],
    });
  }

  // đổi tên nhóm
  rename(converId, newName) {
    let url = `conversation/${converId}/name`;
    return axiosClient.patch(url, {
      name: newName,
    });
  }

  // đổi avatar cho group
  updateAvatar(converId, formData) {
    let url = `/conversation/${converId}/avatar`;
    return axiosClient.patch(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  // send image
  sendImageMessage(converId, pickerResult) {
    let localUri = pickerResult.uri;
    let filename = localUri.split("/").pop();

    let match = /\.(\w+)$/.exec(filename);
    let type = "";
    let url = "";
    type = match ? `image/${match[1]}` : `image`;
    url = "/message/file/IMAGE/" + converId;
    let formData = new FormData();
    formData.append("file", { uri: localUri, name: filename, type });

    return axiosClient.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  // add members to conver
  addMembers(converId, userIds) {
    let url = `conversation/${converId}/members`;
    return axiosClient.post(url, {
      userIds: [...userIds],
    });
  }

  // get lastView of a conver
  getLastView(converId) {
    let url = `conversation/${converId}/last-view`;
    return axiosClient.get(url);
  }

  // delete history messages at my side
  deleteHistoryMessages(converId) {
    let url = `conversation/${converId}/messages`;
    return axiosClient.delete(url);
  }

  // add text message
  addTextMessage(converId, content) {
    let url = `message/text`;
    return axiosClient.post(url, {
      conversationId: converId,
      content: content,
      type: "TEXT",
    });
  }

  // delete group by leader
  deleteGroupByLeader(converId) {
    let url = `conversation/${converId}`;
    return axiosClient.delete(url);
  }

  // send file
  sendFile(converId, pickerResult) {
    let url = "message/file/FILE/" + converId;
    const { name, uri } = pickerResult;
    const uriParts = name.split(".");
    const fileType = uriParts[uriParts.length - 1];
    const formData = new FormData();
    formData.append("file", {
      uri,
      name,
      type: `application/${fileType}`,
    });
    console.log(url);

    return axiosClient.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
}

const converApi = new ConverApi();
export default converApi;
