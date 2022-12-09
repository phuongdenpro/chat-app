import axios from "axios";
import store from "../store";
// let baseURL = "http://192.168.1.87/";
// let baseURL = "http://127.0.0.1:3000/";
// let baseURL = "https://zalo-chat.herokuapp.com/";
// let baseURL = "http://localhost:3000/";
let baseURL = "http://3.1.213.26:3000/";

const axiosClient = axios.create({
  baseURL: baseURL,
  headers: {
    "content-type": "application/json",
  },
  // paramsSerializer: (params = {}) => qs.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
  const token = await store.getToken();
  config.headers.token = "Bearer " + token;
  // config.headers.token =
  // "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNGFjYjllOTI3YTBhOTA1NDVjNmU5YyIsInBob25lTnVtYmVyIjoiMDk5OTk5OTk5OSIsIm5hbWUiOiJDb25nIFZhbiBIb2FuZyIsImlhdCI6MTY2NTg0NjY1NywiZXhwIjoxNjY4NDM4NjU3fQ.uHTFL3YsjiW-eIE-X_qgF2_eATqqSOvw3Mm-kNbBF1A";

  // handle token here
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      if (Array.isArray(response.data)) {
        return {
          isSuccess: true,
          data: response.data,
        };
      }
      return {
        isSuccess: true,
        ...response.data,
      };
    } else if (response) {
      return {
        isSuccess: true,
        data: response,
      };
    } else {
      return {
        isSuccess: false,
      };
    }
  },
  (error) => {
    console.log("Response Error:", error);
    return {
      isSuccess: false,
    };
  }
);

export default axiosClient;
