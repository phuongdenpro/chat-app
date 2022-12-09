import {
  Button,
  Modal,
  Image,
  Avatar,
  Typography,
  Space,
  Form,
  Input,
  DatePicker,
  Radio,
  message,
} from "antd";
import React, { useEffect, useState, useRef } from "react";
import {
  MessageOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import store from "../../../store/store";
import { get_info_from_cookie } from "../../../utils/utils";
import Cookies from "js-cookie";
import Uploader from "../upload/uploader";
import api from "../../../utils/apis";
import { validPhone, validPassword } from "../../../utils/regexp";
import moment from "moment";
import { PhoneOutlined, LockOutlined } from "@ant-design/icons";

const UserUpdatePassword = ({
  openEditModal,
  setOpenEditModal,
  type,
  info,
}) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [form] = Form.useForm();
  const passwordRef = useRef();

  const showModal = () => {
    setOpenEditModal(true);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpenEditModal(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpenEditModal(false);
  };

  useEffect(() => {
    const initData = {
      password: Cookies.get("password"),
    };
    // console.log("initData", initData);
    form.setFieldsValue(initData);
  }, []);

  useEffect(() => {
    if (!info) {
      setUser(get_info_from_cookie());
    } else {
      setUser(info);
    }
  }, [info]);

  const updatePassWordUser = async () => {
    try {
      const res = await api.user.change_password(form.getFieldsValue());
      message.success("Đổi mật khẩu thành công!");
      Cookies.set("name", form.getFieldValue("name"));
    } catch {
      message.error("Mật khẩu cũ không đúng!");
    }
  };
  const onFinish = async (values) => {
    // if (!validPhone.test(values.phoneNumber)) {
    //     message.error('Số điện thoại không hợp lệ');
    //     stopLoading(0);
    //     phoneRef.current.focus();
    //     return;
    // }
    if (!validPassword.test(values.newPassword)) {
      message.error("Mật khẩu ít nhất 6 ký tự");
      passwordRef.current.focus();
      return;
    }
    if (values.newPassword != values.repeat_password) {
      message.error("Xác nhận mật khẩu mới không đúng giống nhau");
      passwordRef.current.focus();
      return;
    }
    try {
      const res = await api.user.change_password(form.getFieldsValue());
      message.success("Đổi mật khẩu thành công!");
    } catch {
      message.error("Mật khẩu cũ không đúng!");
    }
  };

  return (
    <>
      <Modal
        open={openEditModal}
        title="Đổi mật khẩu"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        // footer={[
        //     <Button key="back" onClick={handleCancel}>
        //         Hủy
        //     </Button>,
        //     <Button key="submit" type="primary" loading={loading} onClick={updateUserInfo}>
        //         Lưu
        //     </Button>
        // ]}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Mật khẩu cũ"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu!",
              },
            ]}
            name="oldPassword"
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Mật khẩu cũ"
            />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu mới!",
              },
            ]}
            name="newPassword"
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              ref={passwordRef}
              type="password"
              placeholder="Mật khẩu mới"
            />
          </Form.Item>
          <Form.Item
            label="Nhập lại mật khẩu mới"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập lại mật khẩu mới!",
              },
            ]}
            name="repeat_password"
          >
            <Input.Password
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              prefix={<LockOutlined className="site-form-item-icon" />}
              ref={passwordRef}
            />
          </Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
            <Button key="back" onClick={handleCancel}>
              Hủy
            </Button>
          </Space>
        </Form>
      </Modal>
    </>
  );
};
export default UserUpdatePassword;
