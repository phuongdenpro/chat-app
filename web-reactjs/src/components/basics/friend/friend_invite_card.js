import { Avatar, Button, Card, Image, List, message, Popover, Space, Typography } from 'antd';
import React, { useState } from 'react';
import {
    MessageOutlined, ExclamationCircleOutlined, ArrowLeftOutlined,
    MoreOutlined, CheckOutlined, CloseOutlined,
} from '@ant-design/icons';
import { acceptInvite, declineInvite } from '../../../controller/friend';
import UserViewModal from '../user/user_view_modal';
const { Text, Title } = Typography;

const FriendInviteCard = ({item, handleData}) => {
    const [isAcepted, setAcepted] = useState(false)
    const [openUserModal, setOpenUserModal] = useState(false);

    const onAcceptInvite = () => {
        acceptInvite(item.senderId._id, (res) => {
            message.success("Đã chấp nhận lời mời kết bạn!")
            handleData()
        })
    }

    const onDeclineInvite = () => {
        declineInvite(item.senderId._id, (res) => {
            message.success("Đã từ chối lời mời kết bạn!")
            handleData()
        })
    }

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
                            src={item.senderId.avatar ? item.senderId.avatar : "https://i.imgur.com/TV0vz0r.png"}
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
                            }} level={5}>{item.senderId.name}</Typography.Title>
                        </div>
                        <p>Xin chào, hãy kết bạn nhé!</p>
                        <Space>
                            {
                                isAcepted ? 
                                <>
                                    <p>Đã chấp nhận lời mời kết bạn!</p>
                                </> :
                                <>
                                    <Button type="primary" icon={<CheckOutlined />} onClick={onAcceptInvite}>Chấp nhận</Button>
                                    <Button type="danger" icon={<CloseOutlined />} onClick={onDeclineInvite}>Từ chối</Button>
                                </>   
                            }
                            
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
            <UserViewModal openUserModal={openUserModal} setOpenUserModal={setOpenUserModal} info={item.senderId} />
        </Card>
    )
}

export default FriendInviteCard;