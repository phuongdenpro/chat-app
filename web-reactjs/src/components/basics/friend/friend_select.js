import { Select } from 'antd';
import React, { useEffect, useState } from 'react';
import api from '../../../utils/apis';
const { Option } = Select;


const FriendSelect = ({placeholder, value, setValue, open, multiple, exclude}) => {
  const [data, setdata] = useState([])
  const [dataOption, setdataOption] = useState([])

  useEffect(() => {
    // console.log("value", value);
  }, [value])

  const handleData = async () => {
     
    const res = await api.friend.list()
    // console.log(res)
    if(res.status == 200){
      setdata(res.data)
    }
  }

  useEffect(() => {
    if(data){
      const _children = []
      for (let i = 0; i < data.length; i++) {
        var flag = true;
        if(exclude){
          for(var j=0; j<exclude.length; j++){
            if(exclude[j].userId._id == data[i]._id){
              flag = false
            }
          }
        }
        // if(flag)
          _children.push(<Option {...data[i]} key={data[i]._id}>{data[i].name}</Option>);
      }
      console.log("data change", _children, data, exclude)
      setdataOption(_children)
    }
  }, [data, exclude])

  useEffect(() => {
    if(open == true)
      handleData()
  }, [open])

  useEffect(() => {
      handleData()
  }, [])

  // useEffect(() => {
  //   if(exclude){
  //     console.log("exclude", exclude, data)
  //     const _data = data.filter(usr => {
  //       for(var i=0; i<exclude.length; i++){
  //         if(exclude[i]._id == usr._id){
  //           return false
  //         }
  //       }
  //       return true
  //     })
  //     console.log(_data)
  //     setdata(_data)
  //   }
  // }, [exclude])

  useEffect(() => {
    // console.log("open", open)
  }, [open])

  return (
    <Select
      mode={multiple ? "multiple" : ""}
      allowClear
      style={{
        width: '100%',
      }}
      placeholder={placeholder ? placeholder : "Thêm bạn bè vào cuộc hội thoại"}
      onChange={setValue}
      value={value}
      fil
    >
      {dataOption}
    </Select>
  )
};
export default FriendSelect;