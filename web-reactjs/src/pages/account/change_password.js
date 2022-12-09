import {
  PhoneOutlined,
  LockOutlined,
  UserOutlined,
  CodeOutlined,
} from "@ant-design/icons";
import { Button, Col, Row, Checkbox, Form, Input, message } from "antd";
import { Typography } from "antd";
import React, { useState, useRef } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api, { AccountApi } from "../../utils/apis";
import store, { setUser } from "../../store/store";
// import { setToken } from '../../store/store'
import { validPhone, validPassword } from "../../utils/regexp";

import { authentication } from "../../firebase/firebaseConfig";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { async } from "@firebase/util";

const { Title } = Typography;

const ChangePassWord = () => {
  // const dispatch = useDispatch();
  // let history = useHistory();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const [loadings, setLoadings] = useState([]);
  const [flag, setFlag] = useState(false);
  const [password, setPassword] = useState("");

  const [expandForm, setExpandForm] = useState(true);
  const [form] = Form.useForm();
  const regex = /^0/i;
  let { phoneNumber } = useParams();
  // console.log(phoneNumber);

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
  };

  const stopLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = false;
      return newLoadings;
    });
  };

  const onFinish = async (values) => {
    if (!validPassword.test(values.password)) {
      message.error("Mật khẩu ít nhất 6 ký tự");
      stopLoading(0);
      passwordRef.current.focus();
      return;
    }
    if (values.password != values.repeat_password) {
      message.error("Mật khẩu không giống nhau");
      stopLoading(0);
      passwordRef.current.focus();
      return;
    }

    try {
      const res = await api.user.getUserByPhoneNumber(phoneNumber);
      const user = res.data;
      // console.log(user);
      await api.user.update_password(user._id, { password: password });
      message.success("Lấy lại mật khẩu thành công!");
      navigate("/dang-nhap");
    } catch {
      message.error("Mật khẩu cũ không đúng!");
    }

    //   requestOTP();

    // const accountApi = new AccountApi();
    // try {
    //   const response = await accountApi.register(values);
    //   // console.log(response);
    //   if (response.status == 200) {
    //     message.success("Đăng ký thành công!");
    //     navigate("/dang-nhap");
    //   } else {
    //     message.error("Có lỗi xảy ra");
    //   }
    // } catch (error) {
    //   // console.log("Failed:", error);
    //   message.error("Có lỗi xảy ra");
    // } finally {
    //   stopLoading(0);
    // }
  };

  const onFinishFailed = (errorInfo) => {
    // console.log("Failed:", errorInfo);
    message.error("Có lỗi xảy ra");
  };

  return (
    <Row
      justify="space-around"
      align="middle"
      style={{
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Col
        span={8}
        xs={18}
        sm={14}
        md={10}
        lg={8}
        style={{
          backgroundColor: "white",
          padding: "50px",
          borderRadius: "10px",
        }}
      >
        <Title level={2} style={{ marginBottom: "20px" }}>
          Lấy lại mật khẩu
        </Title>
        <Form
          form={form}
          // onSubmit={requestOTP}
          name="normal_changePass"
          className="changePass-form"
          onFinish={onFinish}
          style={{ display: !flag ? "block" : "none" }}
        >
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu!",
              },
            ]}
          >
            <Input.Password
              size="large"
              ref={passwordRef}
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu mới"
            />
          </Form.Item>
          <Form.Item
            name="repeat_password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập lại mật khẩu!",
              },
            ]}
          >
            <Input.Password
              size="large"
              ref={passwordRef}
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Nhập lại mật khẩu"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="changePass-form-button"
              size="large"
              loading={loadings[0]}
            >
              Đổi mật khẩu
            </Button>
          </Form.Item>
          <br></br>
          <p>
            <Link to="/dang-nhap">Đăng nhập ngay</Link>{" "}
          </p>
          
        </Form>
      </Col>
    </Row>
  );
};

export default ChangePassWord;
