import { Button, Space, Input, Typography} from 'antd';
import React, { useEffect, useState } from 'react';
import {
    CloseOutlined, UsergroupAddOutlined
} from '@ant-design/icons';
import ConversationModal from '../basics/conversation/create_group_modal';
const { Search } = Input;
const { Text } = Typography;
const ActionBar = (props) => {
    const [openModal, setOpenModal] = useState(false);

    const onSearch = (value) =>  console.log(value);
    

    return (
        <div style={{
            padding: '10px',
            display: 'flex',
            justifyContent: 'space-between'
        }}>
            <Input
                placeholder="Tìm kiếm"
                style={{
                    flex: 1,
                    marginRight: '10px'
                }}
                onClick={
                    () => props.setShowSearchingList(true)
                }
            />
            <Space>
                {
                    props.showSearchingList ? 
                        <Button type="text" icon={<CloseOutlined />} 
                        onClick={() => {
                            props.setShowSearchingList(false)
                        }}/> :
                        <Button type="text" icon={<UsergroupAddOutlined />} 
                        onClick={() => {
                            setOpenModal(true)
                        }}/>
                }
                
            </Space>
            <ConversationModal {...props} open={openModal} setOpen={setOpenModal}/>
        </div>
    )
}

export default ActionBar