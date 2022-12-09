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


import Cookies from "js-cookie"
import NavSearch from '../../components/core/navsearch.js/navsearch';
import api from '../../utils/apis';
import { deleteMessage } from '../../controller/message';
import socket from '../../socket/socket'
import { newMessageHandler } from '../../socket/conversation_handler'
import store, { setStoreCurentConv } from '../../store/store';
import ConversationInfoModal from '../../components/basics/conversation/info_conversation_modal';

const { Sider } = Layout;


const ConversationPage = (props) => {
  //   const accountApi = new AccountApi();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  //   const [hasPerms, setHasPerms] = useState(false);
  const [hasPerms, setHasPerms] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentConv, setCurrentConv] = useState();
  const userId = Cookies.get("_id")
  var oneTime = true;
  const convRef = useRef(conversations)

  useEffect(() => {
    convRef.current = conversations
  })

  useEffect(() => {
    if (oneTime) {
      oneTime = false
      getListConversation()

      socket.on("new-message", (message) => {
        // // console.log("new-message.............", message)
        newMessage(convRef.current, setConversations, message)
      })

      socket.on("create-group-conversation", conversationId => {
        newConversation(convRef.current, setConversations, conversationId)
      })

      socket.on("delete-message", data => {
        // // console.log("delete-message", data)
        deleteMessage(convRef.current, setConversations, data);
      })

      socket.on("rename-conversation", (id, name, saveMessage) => {
        // // console.log("delete-message", data)
        renameConversation(convRef.current, setConversations, id, name, saveMessage);
      })

      socket.on("update-avatar-conversation", (id, avatarUrl, saveMessage) => {
        // // console.log("delete-message", data)
        updateAvatarConversation(convRef.current, setConversations, id, avatarUrl, saveMessage);
      })

      socket.on("delete-all-message", (id) => {
        // // console.log("delete-message", data)
        deleteAllMessage(convRef.current, setConversations, id);
      })


      socket.on("delete-conversation", (id) => {
        // // console.log("delete-message", data)
        deleteConversation(convRef.current, setConversations, id);
      })
      
      socket.on("delete-managers", (data) => {
        // // console.log("delete-message", data)
        deleteManager(convRef.current, setConversations, data);
      })

      
      socket.on("add-managers", (data) => {
        // // console.log("delete-message", data)
        addManager(convRef.current, setConversations, data);
      })

      socket.on("add-reaction", (data) => {
        // // console.log("delete-message", data)
        addReaction(convRef.current, setConversations, data);
      })
    }

    store.subscribe(() => {
      setCurrentConv({...store.getState().currentConv.info})
    })
  }, [])

  const getListConversation = async () => {
    const res = await api.conversation.list()
    // console.log("getListConversation", res)
    const _convs = [...res.data]
    _convs.map(conv => {
      conv.key = conv._id
      conv.count_seen = 0; // tmp
      return conv;
    })
    setConversations(_convs)
    setCurrentConv({...store.getState().currentConv.info})
    return
  }

  // useEffect(() => {
  //   if(socketRef.current){

  //     socketRef.current.on("delete-message", data => {
  //       // console.log("delete-message", data)
  //       deleteMessage(data);
  //     })
  //   }
  // }, socketRef)

  const sort = (_convs, next) => {
    _convs.sort(function (x, y) {
      var dx = Date.parse(x.updatedAt)
      var dy = Date.parse(y.updatedAt)
      return dy - dx
    });
    return _convs
  }

  const getConv = (conversations, conversationId) => {
    for (var i = 0; i < conversations.length; i++) {
      if (conversations[i]._id == conversationId)
        return conversations[i];
    }
    return null;
  }

  const countNotSeen = (conversationId) => {
    const conv = getConv(conversationId);
    var count = 0;
    for (var i = conv.messages; i >= 0; i--) {
      if (conv.messages[i]._id == conv.lastMessageId._id) {
        break;
      }
      count++;
    }
  }

  const newConversation = async (conversations, setConversations, conversationId) => {
    try {
      const res = await api.conversation.get(conversationId)
      // // console.log("new conversation", res)
      const conv = res.data
      conv.key = conv._id
      conv.count_seen = 1
      conv.messages.forEach(msg => {
        if (msg._id == conv.lastMessageId) {
          conv.lastMessageId = msg
        }
      })

      // console.log("conversations", conversations)
      var _convs = [...conversations]
      _convs.push(conv)
      _convs = sort(_convs)
      setConversations(_convs)

      socket.emit("join-conversation", { conversationId })
    } catch {

    }
  }

  const newMessage = async (conversations, setConversations, data) => {
    // if(data.message.userId == info.user)
    // console.log("newMessage", data, userId)
    // console.log("conversations", convRef.current)

    var _convs = [...conversations]
    _convs = _convs.map(conv => {
      const _conv = {...conv}
      if (_conv._id == data.message.conversationId) {
        _conv.messages = [..._conv.messages, data.message]
        _conv.lastMessageId = data.message;
        _conv.updatedAt = data.message.updatedAt
      }
      return _conv
    })
    sort(_convs)
    // console.log("after sort", _convs)
    setConversations(_convs)
    if (data.message.senderId._id != userId)
      plusCountSeen(_convs, setConversations, data.message.conversationId)
  }

  const deleteAllMessage = (conversations, setConversations, id) => {
    // console.log("deleteAllMessage", id)

    var _convs = [...conversations]
    _convs.map(conv => {
      if (conv._id == id) {
        conv.messages = []
      }
    })
    sort(_convs)
    setConversations(_convs)
  }

  const deleteConversation = (conversations, setConversations, id) => {
    // console.log("deleteAllMessage", id)

    var _convs = [...conversations]
    for(var i=0; i<_convs.length; i++){
      if (_convs[i]._id == id) {
        _convs.splice(i, 1)
        break
      }
    }
    sort(_convs)
    setConversations(_convs)
  }

  const deleteMessage = (conversations, setConversations, data) => {
    // if(data.message.userId == info.user)
    // console.log("deleteMessage", data, userId)
    // console.log("conversations", conversations)

    var _convs = [...conversations]
    _convs.map(conv => {
      if (conv._id == data.message.conversationId) {
        conv.messages.map(msg => {
          if (msg._id == data.message._id) {
            msg.isDeleted = true;
          }
          return msg
        })
      }
    })
    sort(_convs)
    setConversations(_convs)
    // if(data.message.senderId != userId)
    //     plusCountSeen(_convs, setConversations, data.message.conversationId)
  }

  const renameConversation = async (conversations, setConversations, id, name, saveMessage) => {
    var _conversations = [...conversations]
    _conversations = _conversations.map(conv => {
      var _conv = {...conv}
      if (_conv._id == id) {
        _conv = {..._conv, name: name}
      }
      return _conv
    })
    setConversations(_conversations)
  }

  const updateAvatarConversation = async (conversations, setConversations, id, avatarUrl, saveMessage) => {
    const _conversations = [...conversations]
    _conversations.map(conv => {
      if (conv._id == id) {
        conv.avatar = avatarUrl
      }
    })
    setConversations(_conversations)
  }

  const deleteManager = (conversations, setConversations, data) => {

    var _convs = [...conversations]
    _convs.map(conv => {
      if (conv._id == data.conversationId) {

        const newManagerIds = [...conv.managerIds]
        for(var i=newManagerIds.length-1; i>=0; i--){
          if(data.managerIds.includes(newManagerIds[i])){
            newManagerIds.splice(i, 1)
          }
        }
        conv.managerIds = newManagerIds
        return conv
      }
    })
    setConversations(_convs)
  }

  const addManager = (conversations, setConversations, data) => {
    var _convs = [...conversations]
    for(var i=0; i<_convs.length; i++){
      if (_convs[i]._id == data.conversationId) {
        _convs[i].managerIds.push(data.managerIds[0])
      }
    }
    setConversations(_convs)
  }

  const addReaction = (conversations, setConversations, data) => {
    var _convs = [...conversations]
    for(var i=0; i<_convs.length; i++){
      if (_convs[i]._id == data.conversationId) {
        for(var j=0; j<_convs[i].messages.length; j++){
          if(_convs[i].messages[j]._id == data.messageId){
            for(var h=0; h<_convs[i].messages[j].reacts.length; h++){
              if(_convs[i].messages[j].reacts[h].userId == data.user.id){
                _convs[i].messages[j].reacts.splice(h, 1);
                break
              }
            }
            _convs[i].messages[j].reacts.push({
              _id: 1,
              userId: data.user.id,
              type: Number(data.type)
            })
            // console.log("addReaction", _convs[i].messages[j].reacts)
          }
        }
      }
    }
    setConversations(_convs)
  }

  useEffect(() => {
    if (conversations && currentConv) {

      // console.log("conversations change", conversations)
      conversations.forEach(conv => {
        if (conv._id == currentConv._id) {
          const _currentConv = {...conv}
          _currentConv.messages = [...conv.messages]
          // console.log("_currentConv", _currentConv)

          setCurrentConv(_currentConv)
          // store.dispatch(setStoreCurentConv({..._currentConv}))
          setMessages([...conv.messages])
        }
      })
      // const _hasListen = { ...hasListen }
      // conversations.forEach(conv => {
      //   if (!_hasListen[conv._id]) {
      //     _hasListen[conv._id] = true
      //     // console.log("listen conversation", conv._id, conv.name)
      //     // console.log(conversations)
      //     socketRef.current.on(conv._id, data => {
      //       if (data.type == "new-message") {
      //         newMessage(data)
      //       }
      //     })

      //     // socketRef.current.on("delete-message", data => {
      //     //   // console.log("delete-message", data)
      //     // })
      //   }
      // })
      // setHasListen(_hasListen)
    }
  }, [conversations])

  useEffect(() => {
    // console.log("currentConv", currentConv)

    if (currentConv) {
      conversations.forEach(conv => {
        if (conv._id == currentConv._id) {
          setMessages(conv.messages)
        }
      })
      // store.dispatch(setStoreCurentConv(currentConv))
      // updateCountSeen(convRef.current, setConversations, currentConv._id, 0)
    } else {
      setMessages([])
    }

  }, [currentConv])

  const sendMessage = async (message) => {
    const params = {
      content: message,
      type: 'TEXT',
      conversationId: currentConv._id
    }
    const res = await api.message.addMessageText(params)
    // // console.log("sendMessage", res)
    // // socketRef.current.emit('send-message', {
    // //   message: {
    // //     content: message,
    // //     type: "TEXT",
    // //     conversationId: currentConv._id
    // //   }
    // // }
    // // )
  }


  const plusCountSeen = (conversations, setConversations, conversationId) => {
    const conv = getConv(conversations, conversationId)
    // console.log("plusCountSeen", conv, conversations)
    updateCountSeen(conversations, setConversations, conversationId, conv.count_seen + 1)
  }

  const updateCountSeen = (conversations, setConversations, conversationId, count) => {
    const convs = [...conversations];
    convs.map(conv => {
      if (conv._id == conversationId) {
        conv.count_seen = count
      }
      return conv
    })
    setConversations(convs)
  }

  const onLeaveGroup = (conv) => {
    const _convs = [...convRef.current]
    var idx;
    // console.log("onLeaveGroup", _convs)
    for (var i = 0; i < _convs.length; i++) {
      if (_convs[i]._id == conv._id) {
        idx = i
        break
      }
    }
    _convs.splice(idx, 1)
    setConversations(_convs)
    setCurrentConv(null)
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
            <NavSearch {...props} />
            :
            <Conversations
              style={{
                width: '300px',
              }}
              {...props}
              conversations={conversations}
              setConversations={setConversations}
              currentConv={currentConv}
              setCurrentConv={setCurrentConv}
              updateCountSeen={updateCountSeen}
              onLeaveGroup={onLeaveGroup}
            />
        }

      </Col>
      <Col span={18} style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div>
          <Header currentConv={currentConv} />
          <Messages
            messages={messages}
            currentConv={currentConv}
            setMessages={setMessages} />
        </div>
        {!currentConv ? null :
          <MessageSection sendMessage={sendMessage} currentConv={currentConv} />
        }
      </Col>
    </Row>
  );
};

export default ConversationPage;
