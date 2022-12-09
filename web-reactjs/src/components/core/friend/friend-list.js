import { Avatar, Button, Card, Image, List, Popover, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import {
    MessageOutlined, ExclamationCircleOutlined, ArrowLeftOutlined,
    MoreOutlined
} from '@ant-design/icons';
import UserCard from '../../basics/user/user_card';
import FriendTitle from '../../basics/user/friend_title';
import api from '../../../utils/apis';
import socket from '../../../socket/socket';
const { Text, Title } = Typography;

const FriendList = () => {
    const [data, setData] = useState([])
    const [showData, setShowData] = useState([])
    var oneTime = true;
    const dataRef = useRef(data)
    
    useEffect(() => {
        dataRef.current = data
    })

    useEffect(() => {
        if(oneTime){
            oneTime = false
            handleData()
      
            socket.on("accept-friend", (data) => {
              // console.log("accept-friend.............", data)
              newFriend(dataRef.current, setData, data)
            })
      
            socket.on("deleted-friend", (data) => {
              // console.log("deleted-friend.............", data)
              handleData()
            })
            
        }
    }, [])

    useEffect(() => {
        setShowData(data)
    }, [data])

    const newFriend = (data, setData, friend) => {
        // // console.log("list friend", data)
        handleData()
    }

    const handleData = async () => {
     
        const res = await api.friend.list()
        // console.log(res)
        if(res.status == 200){
          setData(res.data)
        }
    }

    const onSearch = (value) => {
        // console.log("on search...", value, data)
        const _showData = data.filter(item => item.name.toLowerCase().includes(value.toLowerCase()) 
            || item.phoneNumber.toLowerCase().includes(value.toLowerCase()))
        setShowData(_showData)
    }

    return (
        <div style={{
            padding: '20px'
        }}>
            <FriendTitle 
                title="Danh sách bạn bè" 
                placeholder="Tìm kiếm bạn bè"
                onSearch={onSearch}
                /> 
            <List
                grid={{
                    gutter: 16,
                    column: 2,
                }}
                dataSource={showData}
                renderItem={(item) => (
                    <List.Item>
                        <UserCard item={item} type="friend"/>
                    </List.Item>
                )}
            />
        </div>
    )
};
export default FriendList;