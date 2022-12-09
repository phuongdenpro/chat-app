import { Avatar, Button, Card, Image, List, message, Popover, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import {
    MessageOutlined, ExclamationCircleOutlined, ArrowLeftOutlined,
    MoreOutlined, UserAddOutlined, CloseOutlined, PlusOutlined
} from '@ant-design/icons';
import AddFriend from '../../core/friend/add-friend';
import api from '../../../utils/apis';
import Cookies from 'js-cookie';
import { deleteFriend } from '../../../controller/friend';
import { mess } from '../../../utils/actions';
import store, { setOpenInfoConversationModal } from '../../../store/store';
import UserViewModal from "../user/user_view_modal"
import { checkManager } from '../../../utils/utils';
const { Text, Title } = Typography;

const MemberItem = ({ item, type, data }) => {
    const [openUserModal, setOpenUserModal] = useState(false);
    const [isLeader, setIsLeader] = useState(false);
    const [isManager, setIsManager] = useState(false);
    const userId = Cookies.get("_id")
    // const [userInfo]

    // useEffect(() => {
    //     console.log("Member item", item, type)
    // }, [item])

    useEffect(() => {
        // // console.log("Member item", item)
        if (data) {
            if (data.leaderId == userId) setIsLeader(true)
            else setIsLeader(false)
            if (data.managerIds && data.managerIds.includes(userId)) setIsManager(true)
            else setIsManager(false)

        }
    }, [data])

    const description = () => {
        if (type == "member") {
            return (
                <></>
            )
        }

        if (type == "admin") {
            // console.log("admin", item)
            return (
                <>
                    {data.leaderId == item.userId._id ? "Trưởng nhóm" : "Quản lý"}
                </>
            )
        }
    }

    const AddFriend = async () => {
        try {
            const res = await api.friend.invite(item.userId._id)
            // console.log("AddFriend", item, res)
            if (res.status == 201) {
                message.success("Gửi lời mời kết bạn thành công!")
            }
        } catch (err) {
            // console.log("Failed, ", err)
            if (err.response.status == 400) {
                message.error("Không thể gửi lại lời mời kết bạn!")
            }
        }
    }

    const general_action = () => {
        return (
            <>
                <div><Button type="text" icon={<MessageOutlined />}
                    onClick={() => {
                        mess(item.userId._id)
                        store.dispatch(setOpenInfoConversationModal(false))
                    }}>Nhắn tin</Button></div>
                <div>
                    <Button
                        type="text"
                        icon={<ExclamationCircleOutlined />}
                        onClick={() => {
                            // setOpenModal(true)
                            setOpenUserModal(true)
                        }}>Xem chi tiết</Button>
                </div>
            </>
        )
    }

    const onAddManager = async () => {
        try {
            const res = await api.conversation.add_manager(data._id, {
                managerId: [item.userId._id]
            })
            message.success("Thêm quản lý thành công!")
        } catch {
            message.error("Thêm quản lý thất bại!")
        }
    }

    const onDeleteManager = async () => {
        try {
            const res = await api.conversation.delete_manager(data._id, {
                managerId: [item.userId._id]
            })
            message.success("Xóa quản lý thành công!")
        } catch {
            message.error("Xóa thất bại!")
        }
    }

    const onKickMember = async () => {
        try {
            const res = await api.conversation.kick_member(data._id, item.userId._id)
        } catch {
            message.error("Xóa thất bại!")
        }
    }

    // console.log("member items", item)

    return (
        <div style={{
            display: 'flex',
            width: '100%'
        }}>
            <div>
                <Avatar
                    src={
                        <Image
                            src={item.userId.avatar ? item.userId?.avatar : "https://i.imgur.com/TV0vz0r.png"}
                            style={{
                                width: 32,
                            }}
                        />
                    }
                />

            </div>
            <div style={{
                display: 'flex',
                flex: '1',
                justifyContent: 'space-between',
                marginLeft: '10px',
            }}>
                <div>
                    <div>
                        <Typography.Title style={{
                            fontWeight: '500'
                        }} level={5}>{item.userId?.name}</Typography.Title>
                    </div>
                    {description()}
                </div>
                {!item.userId || item.userId._id == userId ? null :
                    <Popover content={(
                        <>
                            {general_action()}
                            {item.userId && !item.userId.friends.includes(userId) ?
                                <div>
                                    <Button type="text" icon={<UserAddOutlined />}
                                        onClick={AddFriend}>Gửi lời mời kết bạn</Button>
                                </div>
                                : null}
                            {!isLeader ? null : checkManager(data, item) ?
                                <div>
                                    <Button type="text" icon={<CloseOutlined />}
                                        danger
                                        onClick={onDeleteManager}>Xóa quản lý</Button>
                                </div>
                                :
                                <div>
                                    <Button type="text" icon={<PlusOutlined />}
                                        onClick={onAddManager}>Thêm làm quản lý</Button>
                                </div>
                            }
                            {(!isLeader && !isManager) || data.leaderId == item.userId._id ? null :
                                <div>
                                    <Button type="text" icon={<CloseOutlined />}
                                        danger
                                        onClick={onKickMember}>Kick khỏi nhóm</Button>
                                </div>
                            }
                            {item.userId && !item.userId.friends.includes(userId) ? null
                                :
                                <>
                                    {/* <hr style={{
                                        borderTop: '1px solid #ddd'
                                    }} /> */}
                                    <div>
                                        <Button type="text" icon={<CloseOutlined />} danger
                                            onClick={
                                                () => deleteFriend(item.userId._id, (data) => {
                                                    message.success("Xóa bạn bè thành công")
                                                })
                                            }>Hủy kết bạn</Button></div>
                                </>
                            }
                        </>
                    )} trigger="click">
                        <Button type="text" icon={<MoreOutlined />} />
                    </Popover>
                }
            </div>
            <UserViewModal openUserModal={openUserModal} setOpenUserModal={setOpenUserModal} info={item.userId} />
        </div>
    )
}

export default MemberItem