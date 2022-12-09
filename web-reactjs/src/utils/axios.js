import axios from "axios";
import queryString from "query-string";
import Cookies from "js-cookie";
// import axiosRetry from 'axios-retry';



const base_url = process.env.REACT_APP_BASE_URL

const validRefresh = new RegExp(".*/token/refresh/");
// const base_url = "https://minimart-server.tranvannhan1911.dev/api"
// const base_url = "http://localhost:8000"

const axiosApi = axios.create({
    baseURL: base_url,
    headers: {
        "Content-Type": "application/json",
    },
    paramsSerializer: (params) => queryString.stringify(params),
});

// axiosRetry(axiosApi, {
//     retries: 2, // number of retries
//     retryDelay: (retryCount) => {
//         // console.log(`retry attempt: ${retryCount}`);
//         return retryCount * 1000; // time interval between retries
//     },
//     retryCondition: (error) => {
//         return error.response.status === 401 && !validRefresh.test(error.request.responseURL);
//     },
// });

axiosApi.interceptors.request.use(async (config) => {
    let token = Cookies.get("access");
    if (token) {
        config.headers.token = `Bearer ${token}`;
    }
    return config;
});

// axiosApi.interceptors.response.use(
//     (response) => {
//         // console.log("d1", response)
//         return response;
//     },
//     async (error) => {
//         // console.log(error)
        
//         if (!validRefresh.test(error.request.responseURL)){
//             let refresh_token = Cookies.get("refresh");
            
//             if(refresh_token){
//                 const params = {
//                     refresh: refresh_token,
//                 };
//                 axiosApi
//                     .post("/account/token/refresh/", params)
//                     .then((res) => {
//                         // console.log(res)
//                         if (res.data.code === 1) {
//                             Cookies.set("access", res.data.data.access);
//                             axios.defaults.headers.common[
//                                 "Authorization"
//                             ] = `Bearer ${Cookies.get("access")}`;
//                             // console.log("update")
//                         } else {
                            
//                             throw error;
//                         }
//                     })
//                     .catch(err => {
//                         // console.log("aaaaaaaa")
//                         Cookies.remove("access");
//                         Cookies.remove("refresh");
//                         // console.log("bug", err)
//                     });
//             }
//         }
//         throw error;
//     }
// );

export default axiosApi;