import {
  MoreOutlined,
  UndoOutlined,
  DeleteOutlined,
  CopyOutlined,
  DownloadOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Divider,
  Image,
  List,
  message,
  Popover,
  Space,
} from "antd";
import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import { deleteMessage, removeMessageFromAll } from "../../../controller/message";
import moment from "moment";
import "moment/locale/vi";
import FileItem from "../../basics/conversation/file_item";
import MessageItem from "./message_item";
moment.locale("vi");
const AlwaysScrollToBottom = () => {
  const elementRef = useRef();
  useEffect(() => elementRef.current.scrollIntoView());
  return <div ref={elementRef} />;
};

const Messages = ({messages, setMessages, currentConv}) => {
  const userId = Cookies.get("_id");

  // useEffect(() => {
  //   console.log("Danh sách tin nhắn thay đổi", messages)
  //   // refMessages.current?.scrollToBottom({ behavior: 'smooth' })
  // }, [messages]);

  return (
    <div
      style={{
        padding: "10px",
        overflow: "auto",
        height: "465px",
      }}
    >
      <List
        itemLayout="horizontal"
        dataSource={messages}
        renderItem={(item) => {
          // console.log("thay đổi item", item)
          const _item = {...item}
          return <MessageItem item={_item} messages={messages}
            setMessages={setMessages}
            currentConv={currentConv}/>
        }}
      />
      <AlwaysScrollToBottom />
    </div>
  );
};

export default Messages;
