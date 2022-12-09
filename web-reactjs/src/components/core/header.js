import React, { Component, useEffect, useState } from 'react';
import {
  UserOutlined, UserAddOutlined, UsergroupAddOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { PageHeader, Button, Menu, Dropdown, Input, Space, Avatar, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { truncate } from '../../utils/utils';
import store, { setOpenInfoConversationModal } from '../../store/store';
const { Search } = Input;



const Header = (props) => {
  const [dropdown, setDropdown] = useState()
  const [conversationName, setConversationName] = useState("")
  const userId = Cookies.get("_id");

  const navigate = useNavigate();

  useEffect(() => {
    if (props.currentConv) {
      setDropdown(
        <Dropdown overlay={menu} placement="bottomRight" key="dropdown">
          <Button key="btn" type="text" icon={<MoreOutlined />} />
        </Dropdown>
      )

      var _conversation_name = props.currentConv.name
      if (!_conversation_name && props.currentConv?.members) {
        const other_members = []
        props.currentConv.members.forEach((mem) => {
          if (mem != userId) {
            other_members.push(mem)
          }
        })
        _conversation_name = other_members[other_members.length - 1].name
      }
      setConversationName(_conversation_name)
    } else {
      setDropdown(undefined)
    }
  }, [props.currentConv])

  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <a rel="noopener noreferrer" onClick={() => {
              // navigate("/dang-nhap")
              // setOpenConvInfoModal(true);
              store.dispatch(setOpenInfoConversationModal("true"))
            }}>
              Chi tiết cuộc hội thoại
            </a>
          ),
        },
        // {
        //   key: 'divider',
        //   type: 'divider',
        // },
        // {
        //   key: '2',
        //   label: (
        //     <a rel="noopener noreferrer" onClick={() => {
        //       // navigate("/dang-nhap")
        //     }}>
        //       Thoát khỏi cuộc hội thoại
        //     </a>
        //   ),
        // },
      ]}
    />
  );


  return (
    <PageHeader
      ghost={false}
      title={
        <Space>
          {props.currentConv ?
            <Avatar
              src={props.currentConv?.avatar ? props.currentConv.avatar : "https://cdn-icons-png.flaticon.com/512/119/119591.png"}
            />
            : null }
          <Typography.Text style={{
            maxWidth: '250px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>{conversationName ? truncate(conversationName, 50) : ""}</Typography.Text>
        </Space>
      }
      extra={[dropdown]}
    ></PageHeader>
  )
}


export default Header;