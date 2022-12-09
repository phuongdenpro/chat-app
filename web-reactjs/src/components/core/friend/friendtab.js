import { Avatar, Button, List, Skeleton, Space, Input, Divider, Typography, Popover } from 'antd';
import React, { useEffect, useState } from 'react';
import {
    UserOutlined, UserAddOutlined, UsergroupAddOutlined,
    MoreOutlined, UndoOutlined, DeleteOutlined, ArrowLeftOutlined,
    ExclamationCircleOutlined, TeamOutlined
} from '@ant-design/icons';
import ConversationModal from '../../basics/conversation/create_group_modal';
import ActionBar from '../action';
import { Link } from 'react-router-dom';
import store, { setPage } from '../../../store/store';
const { Search } = Input;
const { Text } = Typography;
const count = 3;

const FriendTab = (props) => {
    const [initLoading, setInitLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [data, setData] = useState([]);

    const onSearch = (value) => console.log(value);

    return (
        <div style={{
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        }}>
            <ActionBar {...props} />
            <Divider style={{
                marginTop: '3px'
            }} />
            <div
                style={{
                    overflow: 'auto',
                    flex: 1
                }}>
                <div
                    style={{
                        width: '100%',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        backgroundColor: `${props.page == "friend-list" ? "#dfdfdf" : "white"}`
                    }}
                    onMouseEnter={(e) => {

                    }}
                    onClick={() => {
                        store.dispatch(setPage("friend-list"))
                    }}>
                    <TeamOutlined /> Danh sách bạn bè
                </div>
                <div
                    style={{
                        width: '100%',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        backgroundColor: `${props.page == "add-friend" ? "#dfdfdf" : "white"}`
                    }}
                    onMouseEnter={(e) => {

                    }}
                    onClick={() => {
                        store.dispatch(setPage("add-friend"))
                    }}>
                    <UserAddOutlined /> Danh sách kết bạn
                </div>
                <div
                    style={{
                        width: '100%',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        backgroundColor: `${props.page == "friend-list-invited" ? "#dfdfdf" : "white"}`
                    }}
                    onMouseEnter={(e) => {

                    }}
                    onClick={() => {
                        store.dispatch(setPage("friend-list-invited"))
                    }}>
                    <UsergroupAddOutlined /> Lời mời kết bạn đã gửi
                </div>
            </div>
        </div>
    );
};

export default FriendTab;