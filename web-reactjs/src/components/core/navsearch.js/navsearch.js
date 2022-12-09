import { Avatar, Button, List, Skeleton, Space, Input, Divider, Typography, Popover, Segmented, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import {
    UserOutlined, UserAddOutlined, UsergroupAddOutlined,
    MoreOutlined, UndoOutlined, DeleteOutlined, ArrowLeftOutlined,
    ExclamationCircleOutlined, TeamOutlined
} from '@ant-design/icons';
import ConversationModal from '../../basics/conversation/create_group_modal';
import ActionBar from '../action';
import { Link } from 'react-router-dom';
import UserShortInfo from '../../basics/user/user_short_info';
import api from '../../../utils/apis';
import Cookies from 'js-cookie';
const { Search } = Input;
const { Text } = Typography;
const count = 3;

const tabs = [
    // {
    //     key: "all",
    //     label: "Tất cả"
    // },
    // {
    //     key: "message",
    //     label: "Tin nhắn",
    // },
    {
        key: "user",
        label: "Người dùng",
    }
]

const NavSearch = (props) => {
    const [initLoading, setInitLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [dataUser, setDataUser] = useState([]);
    const userId = Cookies.get("_id");


    const handleData = async () => {
        const res = await api.user.list()
        // console.log(res)
        if (res.status == 200) {
            const _data = [...res.data]
            for(var i=0; i<_data.length; i++){
                if(_data[i]._id == userId){
                    _data.splice(i, 1)
                    break;
                }
            }
            setDataUser(_data)
        }
    }

    useEffect(() => {
        handleData()
    }, [])

    const onSearch = (value) =>  console.log(value);

    return (
        <div style={{
            backgroundColor: 'white'
        }}>
            <ActionBar {...props} />
            <Divider style={{
                marginTop: '3px',
                marginBottom: '3px'
            }} />
            <div
                style={{
                    height: "80vh",
                    overflow: 'auto',
                    padding: '10px'
                }}>
                <Tabs
                    defaultActiveKey="2"
                    style={{
                        margin: 'auto'
                    }}
                    items={tabs.map((item) => {
                        return {
                            label: (
                                <span>
                                    {/* <Icon /> */}
                                    {item.label}
                                </span>
                            ),
                            key: `${item.key}`,
                            children: (
                                <List
                                    dataSource={dataUser}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <UserShortInfo item={item} type="user" />
                                        </List.Item>
                                    )}
                                />
                            )
                        };
                    })}
                />
            </div>
        </div>
    );
};

export default NavSearch;