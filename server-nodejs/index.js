const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const userRouter = require("./routers/user");
const validateUser = require("./validate/validateUser");
const authRouter = require("./routers/auth");
const conversationRouter = require("./routers/conversation");
const messageRouter = require("./routers/message");
const friendRouter = require("./routers/friend");
const databaseConnect = require("./config/database");
const socket = require("./socket/socket");
const { verifyToken } = require("./controllers/middlewareController");
const meRouter = require("./routers/me");


const server = require("http").Server(app);

const socketIo = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
socket(socketIo);
// conversationRouter(io);

dotenv.config();
databaseConnect();

app.use(cors());
app.use(morgan("common"));
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/me", verifyToken, meRouter(socketIo))
app.use("/conversation", verifyToken, conversationRouter(socketIo));
app.use("/friends", verifyToken, friendRouter(socketIo));
app.use("/message", verifyToken, messageRouter(socketIo));

server.listen(process.env.PORT || 3000, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});
