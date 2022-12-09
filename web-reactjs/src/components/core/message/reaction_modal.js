import { Avatar, Button, Image, List, Modal, Tabs, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import api from '../../../utils/apis';
import { reactionMap } from '../../../utils/utils';

const ReactionItem = ({ item }) => {
    const [user, setUser] = useState({})
    useEffect(() => {
        if(item){
            // console.log("ReactionItem", item)
            handleData()
        }
    }, [item])

    const handleData = async () => {
        try{
            const res = await api.user.get(item.userId)
            setUser(res.data)
        }catch{
            
        }
    }

    return (
        <div style={{
            display: 'flex',
            width: '100%',
            marginBottom: '5px'
        }}>
            <div>
                <Avatar
                    src={
                        <Image
                            src={user.avatar ? user.avatar : "https://i.imgur.com/TV0vz0r.png"}
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
                        }} level={5}>{user.name}</Typography.Title>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ReactionList = ({reacts}) => {
    return <List 
                dataSource={reacts}
                renderItem={(item) => {
                    // console.log("item", item)
                    return <ReactionItem item={item}/>
                }}/>
}

const ReactionModal = ({ isModalOpen, setIsModalOpen, item }) => {
    const [data, setData] = useState([[], [], [], [], [], [], []])
    const [tabs, setTabs] = useState([[], [], [], [], [], [], []])

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onChange = (key) => {
        console.log(key);
    };

    useEffect(() => {
        if (item && item.reacts) {
            const _data = [[], [], [], [], [], [], []]
            item.reacts.forEach(react => {
                _data[react.type].push(react)
                _data[0].push(react)
            })
            // console.log("reacts", item.reacts, _data)
            setData(_data)
        }
    }, [item])

    useEffect(() => {
        if(data){
            // console.log("data", data)
            const allTabs = {
                label: `Tất cả`,
                key: '0',
                children: <ReactionList reacts={data[0]} />,
            }
            var _tabs = [allTabs]
            for(var i=1; i<data.length; i++){
                if(data[i].length == 0){
                    // _tabs.push([])
                    continue;
                }
                console.log("create tabs", data[i][0].type, data[i])
                _tabs.push({
                    label: <img style={{ width: '15px' }} src={require(`../../../assets/${reactionMap(data[i][0].type)}`)} />,
                    key: data[i][0].type,
                    children: <ReactionList reacts={data[i]} />,
                })
            }
            console.log("tabs", _tabs)
            setTabs(_tabs)
        }
    }, [data])

    return (
        <>
            <Modal visible={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}
            >
                <Tabs
                    defaultActiveKey="1"
                    onChange={onChange}
                    items={tabs}
                />
            </Modal>
        </>
    );
};
export default ReactionModal;