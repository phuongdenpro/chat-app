import { Avatar, Button, Form, Image, Input, message, Modal } from 'antd';
import React, { useState } from 'react';
import api from '../../../utils/apis';
import FriendSelect from '../friend/friend_select';
import UserMember from '../user/user_searching';
import UserSelect from '../user/user_select';

const ConversationModal = ({open, setOpen}, props) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [form] = Form.useForm();
  var friendSelectKey = 0;

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const createConversation = async () => {
    try{
      const values = form.getFieldsValue()
      values.userIds = users
      const res = await api.conversation.create_group(values)
      // console.log("createConversation", res)
      if(res.status == 201){
        message.success("Tạo nhóm thành công")
        setOpen(false)
        // props.setCurrentConv()
      }
    }catch(err){
      // console.log("Failed, ", err)
    }
    
  }

  return (
    <>
      <Modal
        open={open}
        title="Tạo cuộc trò chuyện"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={createConversation}>
            Tạo nhóm
          </Button>
        ]}
      >
        <Form
            form={form}
            onFinish={createConversation}
            layout="vertical">
                
            <Form.Item name="name">
                <div style={{
                    display: 'flex'
                }}>
                    <Avatar
                        src={
                            <Image
                                src="https://joeschmoe.io/api/v1/random"
                                style={{
                                    width: 32,
                                }}
                            />
                        }
                    />
                    <Input placeholder="Tên nhóm" style={{
                        marginLeft: '10px'
                    }} />
                    
                </div>
            </Form.Item>
            <Form.Item label="Thêm thành viên vào nhóm" name="users">
                <FriendSelect multiple={true} key={++friendSelectKey} {...props} open={open} value={users} setValue={setUsers}/>
            </Form.Item>
            {/* <div>
                <UserSelect />
            </div> */}
        </Form>
      </Modal>
    </>
  );
};
export default ConversationModal;