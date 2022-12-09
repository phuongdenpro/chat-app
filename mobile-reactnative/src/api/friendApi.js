import axiosClient from "./axiosClient";

class FriendApi {
  getAllFriends() {
    let url = "friends";
    return axiosClient.get(url);
  }

  getAllRequestToMe() {
    let url = "friends/invites";
    return axiosClient.get(url);
  }

  getAllRequestFromMe() {
    let url = "friends/invites/me";
    return axiosClient.get(url);
  }

  acceptFriend(_id) {
    let url = "friends/" + _id;
    return axiosClient.post(url);
  }

  refuseFriend(userId) {
    let url = `friends/invites/${userId}`;
    return axiosClient.delete(url);
  }

  deleteFriend(_id) {
    let url = "friends/" + _id;
    return axiosClient.delete(url);
  }

  addFriend(_id) {
    let url = "friends/invites/me/" + _id;
    return axiosClient.post(url);
  }

  deleteRequest(_id) {
    let url = "friends/invites/me/" + _id;
    return axiosClient.delete(url);
  }
}

const friendApi = new FriendApi();
export default friendApi;
