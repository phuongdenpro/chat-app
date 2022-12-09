import { Col, Layout, Row } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import { Typography } from 'antd';
import Header from '../components/core/header';
import SideNav from '../components/core/sidenav';
import Conversations from '../components/core/conversation/conversations';
import { Content } from 'antd/lib/layout/layout';
import Messages from '../components/core/message/messages';
import MessageSection from '../components/core/message_section';

import socketIOClient from "socket.io-client";

import Cookies from "js-cookie"

const host = process.env.REACT_APP_BASE_URL;
const { Sider } = Layout;


const HomePage = () => {
  //   const accountApi = new AccountApi();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  //   const [hasPerms, setHasPerms] = useState(false);
  const [hasPerms, setHasPerms] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentConv, setCurrentConv] = useState();
  const userId = Cookies.get("_id")
  const [hasListen, setHasListen] = useState({});
  var oneTime = true;

  const socketRef = useRef();

  useEffect(() => {
    // console.log("info", userId)
    if (oneTime) {
      oneTime = false
      socketRef.current = socketIOClient.connect(host, { query: `access=${Cookies.get("access")}` })
      // 

      socketRef.current.on('connect', function () {
        // console.log("socketRef.current", socketRef.current, socketRef.current.id)

        // listen response all
        socketRef.current.on(socketRef.current.id, data => {
          // console.log("response", data)

          if (data.conversations) {
            setConversations(data.conversations)
          }
        })


        // socketRef.current.emit('get-conversations')
      });
    }
  }, []);

  const newMessage = (data) => {
    // if(data.message.userId == info.user)

    const _convs = [...conversations]
    _convs.map(conv => {
      if (conv._id == data.message.conversationId) {
        // console.log("add")
        conv.messages.push(data.message)
        conv.lastMessage = {
          _doc: data.message
        }
      }
    })
    setConversations(_convs)
  }

  useEffect(() => {
    if (conversations) {
      const _hasListen = { ...hasListen }
      conversations.forEach(conv => {
        // console.log("listen", conv._id, hasListen, hasListen[conv._id])
        if (!_hasListen[conv._id]) {
          socketRef.current.on(conv._id, data => {
            // console.log("conversations", data)
            if (data.type == "new-message") {
              newMessage(data)
            }
          })
          _hasListen[conv._id] = true
        }
      })
      setHasListen(_hasListen)
    }
  }, [conversations])

  useEffect(() => {
    // console.log("currentConv", currentConv)
    if (currentConv) {
      conversations.forEach(conv => {
        if (conv._id == currentConv._id) {
          setMessages(conv.messages)
          // console.log("setMessage")
        }
      })
    }

  }, [currentConv])

  const handleAuthentication = async () => {
    const access = Cookies.get("access")
    const refresh = Cookies.get("refresh")
    if (access == null || refresh == null) {
      navigate('/dang-nhap')
      return
    }

    // try{
    //   const response = await accountApi.get_info()
    //   // console.log("account", response)
    //   if(response.data.code!=1 || !response.data.data.is_superuser){
    //     navigate('/dang-nhap')
    //   }else{
    //     setHasPerms(true)
    //     sessionStorage.setItem("idStaff", response.data.data.id);
    //     sessionStorage.setItem("nameStaff", response.data.data.fullname);
    //     sessionStorage.setItem("phoneStaff", response.data.data.phone);
    //   }
    // }catch(error){
    //   navigate('/dang-nhap')
    // }
  }

  useEffect(() => {
    handleAuthentication()
  }, []);

  const sendMessage = (message) => {
    // console.log("sending", message)
    socketRef.current.emit('send-message', {
      message: {
        content: message,
        type: "TEXT",
        conversationId: currentConv._id
      }
    }
    )
  }

  return (
    <Layout>{hasPerms == false ? null : (
      <>
        <Sider trigger={null} collapsed={true}
          style={{
            height: "100vh",
            overflow: 'auto',
          }}>
          <SideNav ></SideNav>
        </Sider>
        <Layout className="site-layout"
          style={{
            height: "100vh",
          }}>
          <Content style={{
            height: "90vh",
          }}>
            <Row style={{ height: "90vh" }}>
              <Col span={6} style={{
                borderRight: '1px solid #ddd',
                height: "90vh"
              }}>
                <Conversations
                  style={{
                    width: '300px',
                  }}
                  conversations={conversations}
                  currentConv={currentConv}
                  setCurrentConv={setCurrentConv} />
              </Col>
              <Col span={18} style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                <div>
                  <Header />
                  <Messages
                    messages={messages}
                    setMessages={setMessages} />
                </div>
                <MessageSection sendMessage={sendMessage} />
              </Col>
            </Row>
          </Content>
        </Layout>
      </>
    )}
    </Layout>
  );
};

export default HomePage;
