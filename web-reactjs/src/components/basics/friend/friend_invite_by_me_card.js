import { Avatar, Button, Card, Image, List, message, Popover, Space, Typography } from 'antd';
import React, { useState } from 'react';
import {
    MessageOutlined, ExclamationCircleOutlined, ArrowLeftOutlined,
    MoreOutlined, CheckOutlined, CloseOutlined,
} from '@ant-design/icons';
import { acceptInvite, declineInvite } from '../../../controller/friend';
import api from '../../../utils/apis';
import UserViewModal from '../user/user_view_modal';
const { Text, Title } = Typography;

const FriendInviteByMeCard = ({item, handleData}) => {
    const [openUserModal, setOpenUserModal] = useState(false);
    const [isAcepted, setAcepted] = useState(false)

    const onRemoveInvite = async () => {
        try{
            const res = await api.friend.remove_invite(item.receiverId._id)
            // console.log(res)
            message.success("Xóa lời mời kết bạn thành công!")
            handleData()
        }catch{
            message.error("Có lỗi xảy ra!")
        }
    }

    // const onDeclineInvite = () => {
    //     declineInvite(item.receiverId._id, (res) => {
    //         message.success("Đã từ chối lời mời kết bạn!")
    //         handleData()
    //     })
    // }

    return (
        <Card style={{
            cursor: 'pointer'
        }}
        onClick={() => {

        }}
        >
            <div style={{
                display: 'flex',
            }}>
                <div>
                    <Avatar
                        src={
                            <Image
                            src={item.receiverId.avatar ? item.receiverId.avatar : "https://i.imgur.com/TV0vz0r.png"}
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
                            }} level={5}>{item.receiverId.name}</Typography.Title>
                        </div>
                        <p>Đã gửi lời mời kết bạn!</p>
                        <Space>
                            <Button type="danger" icon={<CloseOutlined />} onClick={onRemoveInvite}>Xóa lời mời kết bạn</Button>
                            
                        </Space>
                    </div>
                    <Popover content={
                        <div>
                            <div>
                                <Button 
                                    type="text" 
                                    icon={<ExclamationCircleOutlined />} 
                                    onClick={() => {
                                        setOpenUserModal(true)
                                    }}>Xem chi tiết</Button>
                            </div>
                            
                        </div>
                    } trigger="click">
                        <Button type="text" icon={<MoreOutlined />} />
                    </Popover>
                </div>
            </div>
            {/* <div style={{
                display: 'flex',
                justifyContent: 'flex-end'
            }}>
                <Button type="text" icon={<MessageOutlined color='blue'/>}></Button>
            </div> */}
            <UserViewModal openUserModal={openUserModal} setOpenUserModal={setOpenUserModal} info={item.receiverId} />
        </Card>
    )
}

export default FriendInviteByMeCard;