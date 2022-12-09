import { Avatar, Button, Card, Image, List, message, Popover, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import {
    MessageOutlined, ExclamationCircleOutlined, ArrowLeftOutlined,
    MoreOutlined, UserAddOutlined, CloseOutlined,
} from '@ant-design/icons';
import AddFriend from '../../core/friend/add-friend';
import api from '../../../utils/apis';
import Cookies from 'js-cookie';
import { deleteFriend } from '../../../controller/friend';
import FriendSelect from '../friend/friend_select';
import MemberGroupTab from './member_group_tab';
const { Text, Title } = Typography;

const MemberConversation = ({ data }, props) => {
    const [friendSelected, setFriendSelected] = useState([]);
    const [dataMember, setDataMember] = useState([]);

    const addMember = async () => {
        console.log("friendSelected", friendSelected)
        try {
            const res = await api.conversation.add_member(data._id, {
                userIds: friendSelected
            })
            setFriendSelected([])
            console.log(res)
        } catch {
            message.error("Không thể thêm thành viên!")
        }
    }

    const handleMemberData = async () => {
        const res = await api.conversation.list_member(data._id);
        if (res.status == 200) {
            setDataMember(res.data);
            console.log("handleMemberData", data, res.data)

            //   var _leader;
            //   for(var i=0; i<res.data.length; i++){
            //     if(res.data[i].userId._id == data.leaderId)
            //       _leader = res.data[i]
            //   }
            //   setLeader(_leader)
        }
    };

    useEffect(() => {
        handleMemberData()
    }, [])

    return (
        <div>
            <div style={{
                display: 'flex'
            }}>
                <FriendSelect exclude={dataMember} multiple={true} {...props} value={friendSelected} setValue={setFriendSelected} />
                <Button type='primary' style={{
                    marginLeft: '10px'
                }}
                    onClick={addMember}
                >Thêm</Button>
            </div>
            <MemberGroupTab data={data} />
        </div>
    )
}

export default MemberConversation