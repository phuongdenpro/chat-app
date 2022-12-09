import {
  MessageOutlined, UserOutlined, SettingOutlined, LogoutOutlined
} from '@ant-design/icons';
import { Avatar, Menu } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import { useNavigate } from 'react-router-dom'
import { Typography } from 'antd';
import React, { useState } from 'react';
import store, { setPage } from '../../store/store';
import Cookies from 'js-cookie';
//   import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const { Title } = Typography;

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem('Nhắn tin', 'conversation', <MessageOutlined />),
  getItem('Danh sách bạn bè', 'friend-list', <UserOutlined />),
];

const itemsSetting = [
  // getItem('Cài đặt', 'setting', <SettingOutlined />),
  getItem('Đăng xuất', 'logout', <LogoutOutlined />),
];

const rootSubmenuKeys = ['conversation', 'friend-list', 'setting', 'logout'];

const SideNav = ({setOpenUserModal}) => {
  const [openKeys, setOpenKeys] = useState();
  const navigate = useNavigate();

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);

    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const onSelect = (selected) => {
    //
    if(selected.key == "logout"){
      navigate(`/dang-nhap`)
      return;
    }
    store.dispatch(setPage(selected.key))
  }

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{
        padding: '20px',
        color: 'white'
      }}>
        <Avatar
          src={Cookies.get("avatar")}
          onClick={() => {
            // console.log("click")
            setOpenUserModal(true)
          }}
          style={{
            cursor: 'pointer'
          }}
        />
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: '1'
      }}>
      <Menu
        mode="inline"
        theme="dark"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        items={items}
        onSelect={onSelect}
        onClick={onSelect}
      />
      <Menu
        mode="inline"
        theme="dark"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        items={itemsSetting}
        onSelect={onSelect}
        onClick={onSelect}
      />
      </div>
    </div>
  );
};

export default SideNav;