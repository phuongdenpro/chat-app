import axiosClient from "./axiosClient";

class MessApi {
  getAllConvers() {
    let url = "conversation/";
    return axiosClient.get(url);
  }

  getMessageById(id) {
    let url = `/message/${id}`;
    return axiosClient.get(url);
  }

  pinMessage(messageId) {
    let url = "message/pins/" + messageId;
    return axiosClient.post(url);
  }

  getAllPinMessageByConverId(converId) {
    let url = `message/pins/${converId}`;
    return axiosClient.get(url);
  }

  removePinMessage(messageId) {
    let url = "message/pins/" + messageId;
    return axiosClient.delete(url);
  }

  addReaction(messageId, typeOfReact) {
    let url = `message/${messageId}/reacts/${typeOfReact}`;
    return axiosClient.post(url);
  }
}

const messApi = new MessApi();
export default messApi;
