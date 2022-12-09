import {
  Avatar,
  Button,
  List,
  Skeleton,
  Space,
  Input,
  Divider,
  Typography,
  Popover,
  Badge,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  UserOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  MoreOutlined,
  UndoOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import ConversationModal from "../../basics/conversation/create_group_modal";
import ActionBar from "../action";
import { truncate, toTimeLastMessage } from "../../../utils/utils";
import store, { getUser, setOpenInfoConversationModal, setStoreCurentConv } from "../../../store/store";
import Cookies from "js-cookie";
import api from "../../../utils/apis";
import ConversationInfoModal from "../../basics/conversation/info_conversation_modal";
import moment from 'moment';
import 'moment/locale/vi';
import FriendOnlinePane from "../../basics/friend/friends_online";
moment.locale('vi');


const { Search } = Input;
const { Text } = Typography;
const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;

const Conversations = (props) => {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const userId = Cookies.get("_id");
  const [openConvInfoModal, setOpenConvInfoModal] = useState(false);

  // useEffect(() => {
  //     // console.log("getUser", getUser())
  //     store.subscribe(() => {
  //         const state = store.getState()
  //         // console.log("store.subscribe", state)
  //     })
  // }, [])

  const onLoadMore = () => {
    setLoading(true);
  };

  // const loadMore =
  //     !initLoading && !loading ? (
  //         <div
  //             style={{
  //                 textAlign: 'center',
  //                 marginTop: 12,
  //                 height: 32,
  //                 lineHeight: '32px',
  //             }}
  //         >
  //             <Button onClick={onLoadMore}>loading more</Button>
  //         </div>
  //     ) : null;

  useEffect(() => {
    if (props.conversations) {
      setInitLoading(false);
    } else {
      setInitLoading(true);
    }
  }, [props.conversations]);

  const leaveGroup = async (item) => {
    try {
      const res = await api.conversation.leave_group(item._id);
      // console.log("leaveGroup", res);
      if (res.status == 204) {
        message.success("Rời nhóm thành công!");
        props.onLeaveGroup(item);
      }
    } catch {
      message.error("Có lỗi xảy ra!");
    }
  };

  const onDeleteConversation = (id) => {
    props.setCurrentConv(null)
  }

  return (
    <div
      style={{
        backgroundColor: "white",
        display: 'flex',
        flexDirection: 'column',
        height: '100vh'
      }}
    >
      <ActionBar {...props} />
      <Divider
        style={{
          marginTop: "3px",
          marginBottom: "3px",
        }}
      />
      <FriendOnlinePane />
      <div
        style={{
          flex: 1,
          overflow: "auto",
        }}
      >
        <List
          className="demo-loadmore-list"
          loading={initLoading}
          itemLayout="horizontal"
          // loadMore={loadMore}
          dataSource={props.conversations}
          renderItem={(item) => {
            var conversation_name = item.name
            if (!conversation_name) {
              const other_members = []
              item.members.forEach((mem) => {
                if (mem != userId) {
                  other_members.push(mem)
                }
              })
              conversation_name = other_members[other_members.length - 1].name
            }
            return (
              <List.Item
                style={{
                  padding: "10px",
                  backgroundColor: `${item._id == props.currentConv?._id ? "#f0f0f0" : ""
                    }`,
                  cursor: "pointer",
                }}
                extra={
                  <Popover
                    content={
                      <div>
                        {/* <div><Button type="text" icon={<CopyOutlined />} >Sao chép tin nhắn</Button></div> */}
                        <div>
                          <Button
                            type="text"
                            icon={<ExclamationCircleOutlined />}
                            onClick={() => {
                              setOpenConvInfoModal(true);
                              // console.log("setOpenInfoConversationModal(true)", setOpenInfoConversationModal("true"))
                              // store.dispatch(setOpenInfoConversationModal(true))
                            }}
                          >
                            Xem chi tiết
                          </Button>
                        </div>

                        {/* {item.type ? (
                          <>
                            <hr
                              style={{
                                borderTop: "1px solid #ddd",
                              }}
                            />
                            <div>
                              <Button
                                type="text"
                                icon={<ArrowLeftOutlined />}
                                danger
                                onClick={() => leaveGroup(item)}
                              >
                                Rời nhóm
                              </Button>

                            </div>
                          </>
                        ) : null} */}
                        {/* <div>
                                                <Button type="text" icon={<DeleteOutlined />} danger>Xóa phía tôi</Button>
                                            </div> */}
                      </div>
                    }
                    trigger="click"
                  >
                    <Button type="text" icon={<MoreOutlined />} />
                  </Popover>
                }
                onClick={(e) => {
                  // console.log("onclick", item, e);
                  props.setCurrentConv(item);
                  props.updateCountSeen(props.conversations, props.setConversations, item._id, 0)

                  // store.dispatch(setStoreCurentConv(item))
                }}
              >
                <Skeleton avatar title={false} loading={item.loading} active>
                  <List.Item.Meta
                    avatar={
                      <Badge count={item.count_seen} showZero={false}>
                        <Avatar
                          src={
                            item.avatar
                              ? item.avatar
                              : "https://cdn-icons-png.flaticon.com/512/119/119591.png"
                          }
                        />
                      </Badge>
                    }
                    title={
                      <Text>
                        {conversation_name ? truncate(conversation_name) : "Không có tên"} <span
                          style={{
                            color: "blue",
                            fontSize: 10,
                            marginLeft: '20px'
                          }}
                        >
                          {item.lastMessageId ? moment(item.lastMessageId.createdAt).fromNow() : null}
                        </span>

                      </Text>



                    }
                    description={

                      <Text
                        style={{
                          fontWeight: `${item.count_seen != 0 ? "600" : "400"}`,
                        }}
                      >
                        {item.lastMessageId ?
                          <span>
                            {" "}
                            {item.lastMessageId.senderId._id == userId
                              ? "Bạn: "
                              : item.lastMessageId.senderId.name + ": "}
                            {item.lastMessageId
                              ? item.lastMessageId.isDeleted
                                ? "Tin nhắn đã bị thu hồi"
                                : item.lastMessageId.deletedWithUserIds.includes(
                                  userId
                                )
                                  ? "Tin nhắn đã bị xóa"
                                  : item.lastMessageId.type == "IMAGE"
                                    ? "Đã gửi một ảnh"
                                    : item.lastMessageId.type == "FILE"
                                      ? "Đã gửi một tập tin"
                                      : item.lastMessageId.type == "VIDEO"
                                        ? "Đã gửi một video"
                                        : item.lastMessageId.content
                              : ""}

                          </span>
                          : null
                        }
                      </Text>
                    }
                  />
                </Skeleton>
              </List.Item>
            );
          }}
        />
      </div>
      <ConversationInfoModal open={openConvInfoModal} setOpen={setOpenConvInfoModal} data={props.currentConv} 
        onDeleteConversation={onDeleteConversation}/>
    </div>
  );
};

export default Conversations;
