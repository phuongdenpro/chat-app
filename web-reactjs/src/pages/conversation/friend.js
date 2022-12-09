import { Col, Layout, Row } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import { Typography } from 'antd';
import Header from '../../components/core/header';
import SideNav from '../../components/core/sidenav';
import Conversations from '../../components/core/conversation/conversations';
import { Content } from 'antd/lib/layout/layout';
import Messages from '../../components/core/message/messages';
import MessageSection from '../../components/core/message_section';
import Cookies from 'js-cookie';
import FriendTab from '../../components/core/friend/friendtab';
import FriendList from '../../components/core/friend/friend-list';
import AddFriend from '../../components/core/friend/add-friend';
import Group from '../../components/core/friend/friend-list-invited';
import NavSearch from '../../components/core/navsearch.js/navsearch';
import FriendListInvited from '../../components/core/friend/friend-list-invited';
const { Sider } = Layout;

const FriendPage = (props) => {
  const navigate = useNavigate();
  const [hasPerms, setHasPerms] = useState(true);

  const handleAuthentication = async () => {
    const access = Cookies.get("access")
    const refresh = Cookies.get("refresh")
    if (access == null || refresh == null) {
      navigate('/dang-nhap')
      return
    }
  }

  useEffect(() => {
    handleAuthentication()
  }, []);

  const content = () => {
    if(props.page == "friend-list"){
      return <FriendList />
    }

    if(props.page == "add-friend"){
      return <AddFriend />
    }

    if(props.page == "friend-list-invited"){
      return <FriendListInvited />
    }
  }

  return (
    <Row style={{ height: "100vh" }}>
      <Col span={6} style={{
        borderRight: '1px solid #ddd',
        height: "100vh"
      }}>
        
      {
        props.showSearchingList 
        ? 
          <NavSearch {...props}/>
        : 
          <FriendTab
            style={{
              width: '300px',
            }} 
            {...props}/>
      }
      </Col>
      <Col span={18} style={{
        height: '100vh',
        display: 'flex',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%'
        }}>
          <Header />
          {content()}
        </div>
        {/* <MessageSection sendMessage={sendMessage} /> */}
      </Col>
    </Row>
  );
}

export default FriendPage;