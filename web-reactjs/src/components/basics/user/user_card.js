import { Avatar, Button, Card, Image, List, message, Popover, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import {
    MessageOutlined, ExclamationCircleOutlined, ArrowLeftOutlined,
    MoreOutlined, CheckOutlined, CloseOutlined,
} from '@ant-design/icons';
import api from '../../../utils/apis';
import store, { setStoreCurentConv, setPage } from '../../../store/store';
import { deleteFriend } from '../../../controller/friend';
import { mess } from '../../../utils/actions';
import UserViewModal from './user_view_modal';
const { Text, Title } = Typography;

const UserCard = ({item, type}) => {
    const [openUserModal, setOpenUserModal] = useState(false);

    const createConversation1vs1 = async () => {
        const res = await api.conversation.create_1vs1({userId: item._id})
        // console.log("createConversation1vs1", res)
        if(res.data.isExists){
            const res2 = await api.conversation.get(res.data._id)
            // console.log("createConversation1vs1 2222222222222", res2.data)

            store.dispatch(setPage("conversation"))
            store.dispatch(setStoreCurentConv(res2.data))
        }else{
            store.dispatch(setPage("conversation"))
            store.dispatch(setStoreCurentConv(res.data))
        }
    }

    const description = () => {
        if(type == "friend"){
            return (
                <>
                    <p>Thích màu tím và ghét sự giả dối</p>
                    <Space>
                        <Button type="primary" icon={<MessageOutlined />} 
                            onClick={createConversation1vs1}>Nhắn tin</Button>
                    </Space>
                </>
            )
        }
        
        if(type == "add-friend"){
            return (
                <>
                    <p>Xin chào, hãy kết bạn nhé!</p>
                    <Space>
                        <Button type="primary" icon={<CheckOutlined />} >Chấp nhận</Button>
                        <Button type="danger" icon={<CloseOutlined />} >Từ chối</Button>
                    </Space>
                </>
            )
        }

        
        if(type == "group"){
            return (
                <>
                    <p>52 thành viên</p>
                </>
            )
        }
    }

    const action = () => {
        if(type == "friend"){
            return (
                <>
                    <div>
                        <div><Button type="text" icon={<MessageOutlined />} 
                        onClick={
                            () => mess(item._id)
                        }>Nhắn tin</Button></div>
                        <div>
                            <Button 
                                type="text" 
                                icon={<ExclamationCircleOutlined />} 
                                onClick={() => {
                                    setOpenUserModal(true)
                                }}>Xem chi tiết</Button>
                        </div>
                        <hr style={{
                            borderTop: '1px solid #ddd'
                        }}/>
                        <div><Button type="text" icon={<CloseOutlined />} danger
                            onClick={
                                () => deleteFriend(item._id, (data) => {
                                    message.success("Xóa bạn bè thành công")
                                })
                            }>Hủy kết bạn</Button></div>
                    </div>
                </>
            )
        }

        if(type == "add-friend"){
            return (
                <>
                    <div>
                        {/* <div><Button type="text" icon={<MessageOutlined />} >Nhắn tin</Button></div> */}
                        <div>
                            <Button 
                                type="text" 
                                icon={<ExclamationCircleOutlined />} 
                                onClick={() => {
                                    setOpenUserModal(true)
                                }}>Xem chi tiết</Button>
                        </div>
                        {/* <hr style={{
                            borderTop: '1px solid #ddd'
                        }}/>
                        <div><Button type="text" icon={<CloseOutlined />} danger>Hủy kết bạn</Button></div> */}
                    </div>
                </>
            )
        }

        
        if(type == "group"){
            return (
                <>
                    <div>
                        {/* <div><Button type="text" icon={<MessageOutlined />} >Nhắn tin</Button></div> */}
                        <div>
                            <Button 
                                type="text" 
                                icon={<ExclamationCircleOutlined />} 
                                onClick={() => {
                                    setOpenUserModal(true)
                                }}>Xem chi tiết</Button>
                        </div>
                        {/* <hr style={{
                            borderTop: '1px solid #ddd'
                        }}/>
                        <div><Button type="text" icon={<CloseOutlined />} danger>Hủy kết bạn</Button></div> */}
                    </div>
                </>
            )
        }
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
                            src={item.avatar ? item.avatar : "https://i.imgur.com/TV0vz0r.png"}
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
                            }} level={5}>{item.name}</Typography.Title>
                        </div>
                        {description()}
                    </div>
                    <Popover content={action} trigger="click">
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
            <UserViewModal openUserModal={openUserModal} setOpenUserModal={setOpenUserModal} info={item} />

        </Card>            
    )
}

export default UserCard;