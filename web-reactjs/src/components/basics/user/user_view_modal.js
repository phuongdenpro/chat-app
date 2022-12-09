import { Button, Modal, Image, Avatar, Typography, Space, Upload } from "antd";
import React, { useEffect, useState } from "react";
import {
  MessageOutlined,
  CheckOutlined,
  CloseOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import store from "../../../store/store";
import { get_info_from_cookie } from "../../../utils/utils";
import Cookies from "js-cookie";
import UserEditModal from "./user_edit_modal";
import UserUpdateAvatarModal from "./user_update_avatar_modal";
import UserUpdatePassword from "./user_update_password_modal";
import ImgCrop from "antd-img-crop";
import moment from 'moment';
import 'moment/locale/vi';
moment.locale('vi');

const UserViewModal = ({ openUserModal, setOpenUserModal, info }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openChangePassModal, setOpenChangePassModal] = useState(false);
  const [openUpdateAvatarModal, setOpenUpdateAvatarModal] = useState(false);
  const [file, setFile] = useState();

  const showModal = () => {
    setOpenUserModal(true);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpenUserModal(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpenUserModal(false);
  };

  useEffect(() => {
    if (!info) {
      setUser(get_info_from_cookie());
    } else {
      setUser(info);
    }
  }, [info]);

  // useEffect(() => {
  //     store.subscribe(() => {
  //         // console.log("on change user", store.getState().user.info)
  //         if(user.name == undefined){
  //             setUser(store.getState().user.info)
  //         }
  //     })
  // }, [])

  const description = (
    <>
      {/* {user._id == Cookies.get("_id") ? null : (
        <Space>
          <Button
            type="primary"
            icon={<MessageOutlined />}
            // onClick={createConversation1vs1}
          >
            Nhắn tin
          </Button>
          <Button type="primary" icon={<CheckOutlined />}>
            Chấp nhận
          </Button>
          <Button type="danger" icon={<CloseOutlined />}>
            Từ chối
          </Button>
        </Space>
      )} */}
    </>
  );

  const action = (
    <>
      {user._id == Cookies.get("_id") ? null : (
        <Space>
          <Button
            type="primary"
            icon={<MessageOutlined />}
          // onClick={createConversation1vs1}
          >
            Nhắn tin
          </Button>
          <Button type="primary" icon={<CheckOutlined />}>
            Chấp nhận
          </Button>
          <Button type="danger" icon={<CloseOutlined />}>
            Từ chối
          </Button>
        </Space>
      )}
    </>
  );

  const handleChangeUploadAvatar = async (info) => {
    if (info.file.status === "done") {
      // console.log("handleChangeUploadAvatar", info);
      setFile(info);
      setOpenUpdateAvatarModal(true);
    }
  };

  const footer = () => {
    const res = []
    if (user._id == Cookies.get("_id")) {
      res.push(
        <Button key="back" onClick={() => {
          setOpenChangePassModal(true);
        }}>Đổi mật khẩu</Button>
      )
      res.push(
        <Button
          key="back"
          onClick={() => {
            setOpenEditModal(true);
          }}
        >
          Cập nhập thông tin
        </Button>
      )
    }
    res.push(
      <Button key="back" onClick={handleCancel}>
        Đóng
      </Button>
    )
    return res
  }

  return (
    <>
      <Modal
        open={openUserModal}
        title="Xem thông tin"
        onCancel={handleCancel}
        footer={footer()}
        style={{
          padding: "0px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={
            {
              display: 'flex'
            }
          }
        >
          <div
            style={
              {
                // justifyContent:'center',
                // alignItems:'center',
              }
            }
          >
            <Avatar
              size={70}
              src={
                <>
                  <Image
                    src={
                      user.avatar
                        ? user.avatar
                        : "https://i.imgur.com/TV0vz0r.png"
                    }
                  // style={{
                  //     width: 32,
                  // }}
                  />
                </>
              }
            />
            {user._id != Cookies.get("_id") ? null :
              <ImgCrop rotate>
                <Upload
                  name="avatar"
                  accept="image/jpeg,image/png"
                  showUploadList={false}
                  customRequest={(options) => {
                    // console.log(options);
                    options.onSuccess(options);
                  }}
                  style={{
                    position: "absolute",
                    marginLeft: "-24px",
                    marginTop: "50px",
                  }}
                  // beforeUpload={beforeUpload}
                  onChange={handleChangeUploadAvatar}
                >
                  <Button type="text" icon={<CameraOutlined />}></Button>
                </Upload>
              </ImgCrop>
            }
          </div>
          <br></br>
          <div
            style={{
              marginLeft: "20px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span
              style={{
                color: "#8B95A0",
                fontSize: 15,
                fontWeight: "bolder",

              }}
            >
              Họ và tên{" "}
            </span>
            <span style={{ marginLeft: 15 }}>{user?.name}</span>
            <br></br>
            <span
              style={{
                color: "#8B95A0",
                fontSize: 15,
                fontWeight: "bolder",

              }}
            >
              Điện thoại{" "}
            </span>
            <span style={{ marginLeft: 10 }}>{user?.phoneNumber}</span>
            <br></br>
            <span
              style={{
                color: "#8B95A0",
                fontSize: 15,
                fontWeight: "bolder",

              }}
            >
              Ngày sinh
            </span>
            <span style={{ marginLeft: 15 }}>{user?.dateOfBirth ? moment(user?.dateOfBirth).format("DD-MM-YYYY") : ''}</span>
            <br></br>
            <span
              style={{
                color: "#8B95A0",
                fontSize: 15,
                fontWeight: "bolder",

              }}
            >
              Giới tính{" "}
            </span>
            <span style={{ marginLeft: 20 }}>{user?.gender == "true" ? "Nam" : "Nữ"}</span>
            <div>{description}</div>
          </div>
        </div>
      </Modal>
      <UserEditModal
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
      />
      <UserUpdatePassword
        openEditModal={openChangePassModal}
        setOpenEditModal={setOpenChangePassModal}
      />
      <UserUpdateAvatarModal
        openUpdateAvatarModal={openUpdateAvatarModal}
        setOpenUpdateAvatarModal={setOpenUpdateAvatarModal}
        file={file}
      />
    </>
  );
};
export default UserViewModal;
