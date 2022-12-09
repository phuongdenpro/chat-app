
import Cookies from "js-cookie";
import socketIOClient from "socket.io-client";

const host = process.env.REACT_APP_BASE_URL;
const socket = socketIOClient.connect(host, { query: `access=${Cookies.get("access")}` })

export default socket;