import axiosClient from "./axiosClient";

class AuthApi {
  //[POST] auth/login
  login = (phoneInput, pwdInput) => {
    const url = "auth/login";

    return axiosClient.post(url, {
      phoneNumber: phoneInput,
      password: pwdInput,
    });
  };

  //[GET] auth/login
  loginByToken = async () => {
    const url = "auth/login";

    return axiosClient.get(url);
  };

  //[GET] auth/register
  register = async (props) => {
    const url = "auth/register";

    return axiosClient.post(url, props);
  };
}

const authApi = new AuthApi();
export default authApi;
