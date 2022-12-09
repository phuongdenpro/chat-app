import { Avatar, Button, Collapse, Drawer, Form, Image, Input, List, message, Modal, Popconfirm, Space, Typography, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import api from '../../../utils/apis';
import FriendSelect from '../friend/friend_select';
import UserMember from '../user/user_searching';
import UserSelect from '../user/user_select';
import MemberGroupTab from '../member/member_group_tab';
import {
  EditOutlined, CameraOutlined, ArrowLeftOutlined, DeleteOutlined,
  CloseOutlined
} from "@ant-design/icons";
import ImgCrop from 'antd-img-crop';
import ConversationUpdateAvatarModal from './conversation_update_avatar_modal';
import MemberConversation from '../member/members_conversations';
import store, { setOpenInfoConversationModal, setStoreCurentConv } from '../../../store/store';
import Video_modal from './video_modal';
import FileItem from './file_item';
import Cookies from 'js-cookie';
const { Panel } = Collapse;

const RenameConversationModal = ({ isModalOpen, setIsModalOpen, data }, props) => {
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (data && (newName == "" || !newName)) {
      setNewName(data?.name)
    }
  }, [data])

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (newName.trim() == "") {
      message.error("Tên không được để trống!")
      return
    }
    try {
      const res = await api.conversation.rename(data._id, {
        name: newName
      })
      if (res.status == 200) {
        message.success("Đổi tên thành công")
        setNewName("")
        setIsModalOpen(false);
      }
    } catch {
      message.error("Có lỗi xảy ra!")
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal title="Đổi tên cuộc hội thoại" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Input placeholder="Tên cuộc hội thoại" style={{
          marginLeft: '10px'
        }} value={newName} onChange={e => setNewName(e.target.value)} />
      </Modal>
    </>
  );
};

const ConversationInfoModal = ({ open, setOpen, data }, props) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [form] = Form.useForm();
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [openUpdateAvatarModal, setOpenUpdateAvatarModal] = useState(false);
  const [file, setFile] = useState();
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [files, setFiles] = useState([]);
  const [visibleVideoModal, setVisibleVideoModal] = useState(false);
  const [currentItem, setCurrentItem] = useState();
  const [conversationName, setConversationName] = useState("")
  const userId = Cookies.get("_id");
  var friendSelectKey = 0;

  useEffect(() => {
    store.subscribe(() => {
      // console.log("ConversationInfoModal", store.getState())
      const _isOpen = store.getState().isOpenInfoConversationModal.value == "true"
      // console.log("set open to ", _isOpen, open)
      if (_isOpen != open) {
        setOpen(_isOpen)
      }
    })
  }, [])

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
    store.dispatch(setOpenInfoConversationModal("false"))
  };

  useEffect(() => {
    // console.log("lọc ảnh, video", data)
    if (data && data.messages) {
      const _images = []
      const _videos = []
      const _files = []
      data.messages.forEach(msg => {
        if (msg.type == "IMAGE") {
          _images.push(msg)
        } else if (msg.type == "VIDEO") {
          _videos.push(msg)
        } else if (msg.type == "FILE") {
          _files.push(msg)
        }
      })
      _images.reverse()
      _videos.reverse()
      _files.reverse()
      setImages(_images)
      setVideos(_videos)
      setFiles(_files)
    }

    if (data) {
      var _conversation_name = data.name
      if (!_conversation_name && data?.members) {
        const other_members = []
        data.members.forEach((mem) => {
          if (mem != userId) {
            other_members.push(mem)
          }
        })
        _conversation_name = other_members[other_members.length - 1].name
      }
      setConversationName(_conversation_name)
    }
  }, [data])

  const editConversation = async () => {
    // try{
    //   const values = form.getFieldsValue()
    //   values.userIds = users
    //   const res = await api.conversation.create_group(values)
    //   // console.log("createConversation", res)
    //   if(res.status == 201){
    //     message.success("Tạo nhóm thành công")
    //     setOpen(false)
    //     // props.setCurrentConv()
    //   }
    // }catch(err){
    //   // console.log("Failed, ", err)
    // }

  }

  const handleChangeUploadAvatar = async (info) => {
    if (info.file.status === 'done') {
      // console.log("handleChangeUploadAvatar", info)
      setFile(info)
      setOpenUpdateAvatarModal(true)
    }
  };

  useEffect(() => {
    // console.log("ConversationInfoModal", data)
  }, [data])

  const deleteConversation = async () => {
    try {
      const res = await api.conversation.delete_all_message(data._id);
      // // console.log("deleteConversation", res);
      message.success("Xóa tất cả tin nhắn thành công!");
      props.onDeleteConversation()
    } catch {
      message.error("Có lỗi xảy ra!");
    }
  }

  const leaveGroup = async () => {
    try {
      const res = await api.conversation.leave_group(data._id);
      // console.log("leaveGroup", res);
      if (res.status == 204) {
        message.success("Rời nhóm thành công!");
        // props.onLeaveGroup(data);
        // store.dispatch(setStoreCurentConv(null))
      }
    } catch {
      message.error("Có lỗi xảy ra!");
    }
  };

  const deleteGroup = async () => {
    try {
      const res = await api.conversation.delete_group(data._id);
      // console.log("deleteGroup", res);
      message.success("Xóa nhóm thành công!");
    } catch {
      message.error("Có lỗi xảy ra!");
    }
  };

  return (
    <>
      <Drawer
        placement="right"
        open={open}
        title="Thông tin cuộc hội thoại"
        onOk={handleOk}
        onClose={handleCancel}
        width="400px"
      // extra={[
      //   <Button key="submit" type="primary" loading={loading} onClick={editConversation}>
      //     Lưu
      //   </Button>
      // ]}
      >
        <div>
          <div style={{
            textAlign: 'center'
          }}>
            <Avatar
              size={70}
              src={
                <>
                  <Image
                    src={data?.avatar ? data.avatar : "https://cdn-icons-png.flaticon.com/512/119/119591.png"}
                  // style={{
                  //     width: 32,
                  // }}
                  />
                </>
              }
              style={{
                marginBottom: '10px'
              }}
            />
            <ImgCrop rotate>
              <Upload
                name="avatar"
                accept='image/jpeg,image/png'
                showUploadList={false}
                customRequest={(options) => {
                  // console.log(options)
                  options.onSuccess(options)
                }}
                style={{
                  position: 'absolute',
                  marginLeft: '-24px',
                  marginTop: '50px'
                }}
                // beforeUpload={beforeUpload}
                onChange={handleChangeUploadAvatar}
              >
                <Button
                  type='text'
                  icon={<CameraOutlined />}></Button>
              </Upload>
            </ImgCrop>
            <div>
              <Typography.Title level={4}>
                {conversationName}
                <Button type='text' icon={<EditOutlined />} onClick={() => setIsRenameModalOpen(true)} />
              </Typography.Title>
            </div>
          </div>

          <Collapse ghost>
            {/* {data?.type ? */}
            <Panel header="Thành viên" key="member" style={{
              display: `${data && data.type ? 'block': 'none'}`
            }}>
              <MemberConversation data={data} />
            </Panel>
            <Panel header="Ảnh" key="photo">
              <List
                grid={{
                  gutter: 16,
                  column: 3,
                }}
                dataSource={images}
                renderItem={(item) => (
                  <List.Item>
                    <Image src={item.content} style={{ width: '100%', height: '100%' }}></Image>
                  </List.Item>
                )}
              />
            </Panel>
            <Panel header="Video" key="video">
              <List
                grid={{
                  gutter: 16,
                  column: 2,
                }}
                dataSource={videos}
                renderItem={(item) => (
                  <List.Item>
                    <Button
                      onClick={() => {
                        setCurrentItem(item)
                        setVisibleVideoModal(true)
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        padding: '0'
                      }}>
                      <video src={item.content} style={{
                        width: '100%'
                      }}></video>
                    </Button>
                  </List.Item>
                )}
              />
            </Panel>
            <Panel header="File" key="file">
              <List
                dataSource={files}
                renderItem={(item) => (
                  <List.Item>
                    <FileItem item={item} />
                  </List.Item>
                )}
              />
            </Panel>
            <Panel header="Bảo mật" key="security">
              <Space direction='vertical' style={{ width: '100%' }}>
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa lịch sử cuộc trò chuyện này?"
                  onConfirm={deleteConversation}
                  okText="Đồng ý"
                  cancelText="Hủy bỏ"
                >
                  <Button type='text' style={{ width: '100%', textAlign: 'left', color: 'red' }}>
                    <DeleteOutlined /> Xóa lịch sử trò chuyện phía tôi
                  </Button>
                </Popconfirm>

                <Popconfirm
                  title="Bạn có chắc chắn muốn rời khỏi cuộc trò chuyện này?"
                  onConfirm={leaveGroup}
                  okText="Đồng ý"
                  cancelText="Hủy bỏ"
                >
                  <Button type='text' style={{ width: '100%', textAlign: 'left', color: 'red' }}>
                    <ArrowLeftOutlined /> Rời nhóm
                  </Button>
                </Popconfirm>
                {data?.leaderId == userId ?
                  <Popconfirm
                    title="Bạn đã chắc chắn muốn xóa nhóm?"
                    onConfirm={deleteGroup}
                    okText="Đồng ý"
                    okType='danger'
                    cancelText="Hủy bỏ"
                  >
                    <Button type='text' style={{ width: '100%', textAlign: 'left', color: 'red' }}>
                      <CloseOutlined /> Xóa nhóm
                    </Button>
                  </Popconfirm>
                  : null
                }
              </Space>
            </Panel>
            {/* : null
            }  */}

          </Collapse>
        </div>
      </Drawer>
      <RenameConversationModal setIsModalOpen={setIsRenameModalOpen} isModalOpen={isRenameModalOpen} data={data} />
      <ConversationUpdateAvatarModal
        openUpdateAvatarModal={openUpdateAvatarModal}
        setOpenUpdateAvatarModal={setOpenUpdateAvatarModal}
        file={file}
        conversationId={data?._id} />
      <Video_modal visible={visibleVideoModal} setVisible={setVisibleVideoModal} item={currentItem} />
    </>
  );
};
export default ConversationInfoModal;