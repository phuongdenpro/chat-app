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
    Typography,
} from "antd";
import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import { deleteMessage, removeMessageFromAll } from "../../../controller/message";
import moment from "moment";
import "moment/locale/vi";
import FileItem from "../../basics/conversation/file_item";
import api from "../../../utils/apis";
import ReactPane from "./react_pane";
import ReactionModal from "./reaction_modal";
import { previewReaction, reactionMap } from "../../../utils/utils";
moment.locale("vi");

const MessageItem = ({ item, currentConv }, props) => {
    const userId = Cookies.get("_id");
    const [isOnHover, setOnHover] = useState()
    const [currentReact, setCurrentReact] = useState(0)
    const [isOpenReactionList, setOpenReactionList] = useState(false)

    useEffect(() => {
        // console.log("Change message item", item)
        getCurrentReact()
    }, [item]);

    const card = (item, content) => {
        var dateString = moment(item.createdAt).format("HH:mm");
        var createAtTime = dateString;
        return (
            <div
                style={{
                    backgroundColor: "white",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    position: "relative",
                    margin: "0 20px",
                    maxWidth: "600px",
                }}
            >
                {item.senderId._id == userId ? null : (
                    <div
                        style={{
                            color: "#8b8b8b",
                            fontSize: 15,
                        }}
                    >
                        {item.senderId.name}
                    </div>
                )}
                <div
                    style={{
                        marginTop: 5,
                        color: `${item.isDeleted ? "#" : "black"}`,
                        fontSize: 15,
                        fontWeight: "initial",
                    }}
                >
                    {item.isDeleted ? "Tin nhắn đã bị thu hồi" : content}
                </div>
                <div
                    style={{
                        color: "blue",
                        fontSize: 10,
                    }}
                >
                    {createAtTime}
                </div>
                {/* <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end'
                }}>

                    <Button style={{
                        // visibility: `${isOnHover ? 'visible' : 'hidden'}`,
                        display: 'block',
                    }} type="text"
                        onClick={() => setOpenReactionList(true)}
                        size="small"
                    >
                        <img style={{ width: '20px' }} src={require("../../../assets/like.png")} />
                    </Button>
                </div> */}
                {/* <div style={{
                        // position: 'absolute',
                        right: `${item.senderId._id == userId ? 'none' : '10px'}`,
                        left: `${item.senderId._id == userId ? '10px' : 'none'}`,
                        display: 'flex',
                        flexDirection: "row",
                        justifyContent: 'flex-end'
                    }}>
                        <Button style={{
                            display: 'block',
                        }} type="text"
                            onClick={() => setOpenReactionList(true)}
                            size="small"
                        >
                            <img style={{ width: '20px' }} src={require("../../../assets/like.png")} />
                        </Button>
                        <Popover content={<ReactPane />}>
                            <Button style={{
                                visibility: `${isOnHover ? 'visible' : 'hidden'}`,
                                display: 'block',
                            }} type="text"
                                onClick={onReact}
                                size="small"
                            >
                                <img style={{ width: '20px' }} src={require("../../../assets/like.png")} />
                            </Button>
                        </Popover>
                    </div> */}
            </div>
        );
    };

    const onReact = async (type) => {
        console.log("onReact")
        const res = await api.message.addReact(item._id, type, {
            conversationId: currentConv._id
        })
    }

    const getCurrentReact = () => {
        item.reacts.forEach(react => {
            if (react.userId == userId) {
                setCurrentReact(react.type)
            }
        })
    }

    const content = (item) => {
        var dateString = moment(item.createdAt).format("HH:mm");
        var createAtTime = dateString;
        if (item.type == "IMAGE") {
            return (
                <div
                    style={{
                        margin: "0 20px",
                        backgroundColor: "white",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        position: "relative",
                        // margin: "0 20px",
                        maxWidth: "600px",
                    }}
                >
                    {item.senderId._id == userId ? null : (
                        <span
                            style={{
                                color: "#8b8b8b",
                                fontSize: 15,
                            }}
                        >
                            {item.senderId.name}
                        </span>
                    )}
                    <br></br>
                    <span
                        style={{
                            marginTop: 5,
                            color: `${item.isDeleted ? "#" : "black"}`,
                            fontSize: 15,
                            fontWeight: "initial",
                        }}
                    >
                        {item.isDeleted ? (
                            "Tin nhắn đã bị thu hồi"
                        ) : (
                            <Image
                                src={item.content}
                                style={{
                                    maxWidth: "600px",
                                }}
                            />
                        )}
                    </span>
                    <br></br>
                    <span
                        style={{
                            color: "blue",
                            fontSize: 10,
                        }}
                    >
                        {createAtTime}
                    </span>
                </div>
            );
        } else if (item.type == "FILE") {
            return card(
                item,
                <FileItem item={item} />
            );
        } else if (item.type == "VIDEO") {
            return card(
                item,
                <video
                    style={{
                        width: "600px",
                    }}
                    controls
                    src={item.content}
                ></video>
            );
        } else {
            return card(item, item.content);
        }
    };

    if (item.type == "NOTIFY") {
        if (item.deletedWithUserIds.includes(userId)) {
            return null;
        }
        return (
            <div
                style={{
                    textAlign: "center",
                    fontStyle: "italic",
                    color: "#a3a3a3",
                }}
            >
                <span style={{ color: '#a3a3a3' }}>{item.senderId.name}: </span>
                {item.content}
            </div>
        );
    } else {
        const direction =
            item.senderId._id == userId ? "row-reverse" : "row";
        if (item.deletedWithUserIds.includes(userId)) {
            return null;
        }
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: `${direction}`,
                    marginBottom: "10px",
                }}
            >
                {item.senderId._id == userId ? null : (
                    <Avatar
                        src={
                            item.senderId.avatar == ""
                                ? "https://joeschmoe.io/api/v1/random"
                                : item.senderId.avatar
                        }
                    />
                )}
                <div style={{
                    position: 'relative'
                }}
                    onMouseEnter={(e) => setOnHover(true)}
                    onMouseLeave={() => setOnHover(false)}>
                    {content(item)}
                    <div style={{
                        position: 'absolute',
                        right: `${item.senderId._id == userId ? 'none' : '10px'}`,
                        left: `${item.senderId._id == userId ? '10px' : 'none'}`,
                        display: 'flex',
                        flexDirection: `${item.senderId._id == userId ? "row-reverse" : "row"}`
                    }}>
                        {item.reacts.length == 0 ? null :
                            <Button style={{
                                // visibility: `${isOnHover ? 'visible' : 'hidden'}`,
                                display: 'block',
                                marginTop: '-14px',
                                padding: '0px 5px',
                                border: '1px solid #ddd',
                                borderRadius: '10px'
                            }} type="text"
                                onClick={() => setOpenReactionList(true)}
                                size="small"
                            >
                                <div>
                                    {previewReaction(item.reacts)}

                                    <Typography.Text style={{
                                        marginLeft: '5px'
                                    }}>{item.reacts.length}</Typography.Text>
                                </div>
                            </Button>
                        }
                        <Popover content={<ReactPane onReact={onReact} />}>
                            <Button style={{
                                visibility: `${currentReact != 0 || isOnHover ? 'visible' : 'hidden'}`,
                                display: 'block',
                                marginLeft: '3px',
                                marginRight: '3px',
                                marginTop: '-14px',
                                padding: '0px',
                            }} type="text"
                                onClick={() => onReact(1)}
                                size="small"
                            >
                                {currentReact == 0
                                    ? <img style={{ width: '15px' }} src={require("../../../assets/like.png")} />
                                    : <img style={{ width: '15px' }} src={require(`../../../assets/${reactionMap(currentReact)}`)} />
                                }
                            </Button>
                        </Popover>
                    </div>

                </div>
                {
                    item.isDeleted ? null : (
                        <Space
                        // ref={ref}
                        // style={{
                        //     display: 'none'
                        // }}
                        >
                            <Popover
                                content={
                                    <div>
                                        {item.type == "TEXT" ?
                                            <div>
                                                <Button
                                                    type="text"
                                                    icon={<CopyOutlined />}
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(item.content);
                                                        message.success("Sao chép thành công!");
                                                    }}
                                                >
                                                    Sao chép tin nhắn
                                                </Button>
                                                <hr
                                                    style={{
                                                        borderTop: "1px solid #ddd",
                                                    }}
                                                />
                                            </div>
                                            : null
                                        }
                                        {/* <div><Button type="text" icon={<ExclamationCircleOutlined />} >Xem chi tiết</Button></div> */}

                                        {item.senderId._id == userId ? (
                                            <div>
                                                <Button
                                                    type="text"
                                                    icon={<UndoOutlined />}
                                                    danger
                                                    onClick={() =>
                                                        removeMessageFromAll(item._id, () => {
                                                            message.success("Thu hồi thành công");
                                                        })
                                                    }
                                                >
                                                    Thu hồi
                                                </Button>
                                            </div>
                                        ) : null}
                                        <div>
                                            <Button
                                                type="text"
                                                icon={<DeleteOutlined />}
                                                danger
                                                onClick={() =>
                                                    deleteMessage(item._id, () => {
                                                        const _messages = [...props.messages];
                                                        _messages.map((msg) => {
                                                            if (msg._id == item._id) {
                                                                item.deletedWithUserIds.push(userId);
                                                            }
                                                            return msg;
                                                        });
                                                        props.setMessages(_messages);
                                                        message.success("Xóa thành công");
                                                    })
                                                }
                                            >
                                                Xóa phía tôi
                                            </Button>
                                        </div>
                                    </div>
                                }
                                trigger="click"
                                placement="bottom"
                            >
                                <Button type="text" icon={<MoreOutlined />} />
                            </Popover>
                        </Space>
                    )
                }
                <ReactionModal
                    item={item}
                    isModalOpen={isOpenReactionList}
                    setIsModalOpen={setOpenReactionList} />
            </div >
        );
    }
};

export default MessageItem;
