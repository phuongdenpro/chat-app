import axiosClient from "./axiosClient";

class UserApi {
  findUserByPhoneNumber(phone) {
    let url = `/user/phonenumber/${phone}`;
    return axiosClient.get(url);
  }

  findUserById(_id) {
    let url = `/user/` + _id;
    return axiosClient.get(url);
  }

  updateInfor(infor) {
    let url = "/me/profile";
    return axiosClient.put(url, infor);
  }

  getMyInfor() {
    let url = "me/profile";
    return axiosClient.get(url);
  }

  updatePassword(userId, newPass) {
    let url = "user/password/" + userId;
    return axiosClient.put(url, {
      password: newPass,
    });
  }

  // change avatar
  updateAvatar(pickerResult) {
    let url = "me/avatar";
    let localUri = pickerResult.uri;
    let filename = localUri.split("/").pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    let formData = new FormData();
    formData.append("file", { uri: localUri, name: filename, type });

    return axiosClient.patch(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
}

const userApi = new UserApi();
export default userApi;
