import { List, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import api from "../../../utils/apis";
import MemberItem from "./member_item";
const onChange = (key) => {
  // console.log(key);
};
const MemberGroupTab = ({ data }) => {
  const [dataUser, setDataUser] = useState([]);
  const [dataAdmin, setDataAdmin] = useState([]);
  const [leader, setLeader] = useState({});
  const adminId = data.leaderId;

  const handleData = async () => {
    const res = await api.conversation.list_member(data._id);
    // console.log(adminId);
    // console.log(res);
    if (res.status == 200) {
      setDataUser(res.data);

      var _leader;
      for(var i=0; i<res.data.length; i++){
        if(res.data[i].userId._id == data.leaderId)
          _leader = res.data[i]
      }
      setLeader(_leader)
    }
  };

  useEffect(() => {
    handleData();
  }, [data]);

  useEffect(() => {
    if(dataUser){
      // console.log("dataUser", dataUser)
      const _dataAdmin = dataUser.filter(user => data.managerIds.includes(user.userId._id))
      setDataAdmin([leader, ..._dataAdmin])
    }
  }, [dataUser]);

  // useEffect(() => {
  //   if(dataAdmin){
  //     console.log("dataAdmin", dataAdmin, dataUser)
  //   }
  // }, [dataAdmin]);

  const TabMember = () => {
    return (
      <>
        <List
          dataSource={dataUser}
          renderItem={(item) => (
            <List.Item>
              <MemberItem item={item} type="member" data={data}/>
            </List.Item>
          )}
        />
      </>
    );
  };

  const TabAdmin = () => {
    return (
      <>
        <List
          dataSource={dataAdmin}
          renderItem={(item) => (
            <List.Item>
              <MemberItem item={item} type="admin" data={data} />
            </List.Item>
          )}
        />
      </>
    );
  };

  return (
    <Tabs
      defaultActiveKey="1"
      onChange={onChange}
      items={[
        {
          label: `Thành viên`,
          key: "1",
          children: <TabMember />,
        },
        {
          label: `Admin`,
          key: "2",
          children: <TabAdmin />,
        },
      ]}
    />
  );
};
export default MemberGroupTab;
