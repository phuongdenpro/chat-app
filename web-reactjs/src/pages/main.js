import { Col, Layout, Row } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom'
import SideNav from '../components/core/sidenav';
import { Content } from 'antd/lib/layout/layout';
import Cookies from 'js-cookie';
import { lazy } from "react";
import socket from '../socket/socket'
import store, { setPage, setUser } from '../store/store';
import api from '../utils/apis';
import UserViewModal from '../components/basics/user/user_view_modal';

const ConversationPage = lazy(() => import("./conversation/conversation"));
const FriendPage = lazy(() => import("./conversation/friend"));

const { Sider } = Layout;

const MainPage = () => {
  const navigate = useNavigate();
  const [hasPerms, setHasPerms] = useState(true);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [page, setLocalPage] = useState("conversation");
  const [showSearchingList, setShowSearchingList] = useState(false);

  useEffect(() => {
    store.subscribe(() => {
      // console.log("set page", store.getState().page.info)
      setLocalPage(store.getState().page.info)
    })
  }, [])

  const setStorePage = (_page) => {
    store.dispatch(setPage(_page))

  }

  // const socketRef = useRef();
  // socketRef.current = socketIOClient.connect(host, { query: `access=${Cookies.get("access")}` })

  const handleAuthentication = async () => {
    const access = Cookies.get("access")
    const refresh = Cookies.get("refresh")

    if (access == null || refresh == null) {
      navigate('/dang-nhap')
      return
    }

    try {
      const res = await api.user.get_profile()
      if (res.status == 200) {
        // console.log("Authenticated", res.data)
        const action = setUser(res.data)
        store.dispatch(action)
      } else {
        navigate('/dang-nhap')
        return
      }
    } catch {
      navigate('/dang-nhap')
      return
    }

  }

  useEffect(() => {
    handleAuthentication()
  }, []);

  const _props = {
    page: page,
    openUserModal: openUserModal,
    setOpenUserModal: setOpenUserModal,
    showSearchingList: showSearchingList,
    setShowSearchingList: setShowSearchingList
  }

  const content = () => {
    if (page == "conversation") {
      return (
        <ConversationPage {..._props} />
      )
    }

    if (page == "friend" || page == "friend-list" || page == "add-friend" || page == "friend-list-invited") {
      return (
        <FriendPage {..._props} />
      )
    }
  }


  return (
    <Layout>{hasPerms == false ? null : (
      <>
        <Sider trigger={null} collapsed={true}
          style={{
            height: "100vh",
            overflow: 'auto',
          }}>
          <SideNav {..._props}></SideNav>
        </Sider>
        <Layout className="site-layout"
          style={{
            height: "100vh",
          }}>
          <Content style={{
            height: "100vh",
          }}>
            {content()}
            <UserViewModal {..._props}/>
          </Content>
        </Layout>
      </>
    )}
    </Layout>
  );
}

export default MainPage;