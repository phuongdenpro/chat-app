import { Select } from 'antd';
import React, { useEffect, useState } from 'react';
import api from '../../../utils/apis';
const { Option } = Select;


const UserSelect = ({placeholder, value, setValue}) => {
  const [data, setdata] = useState([])
  const [dataOption, setdataOption] = useState([])

  useEffect(() => {
    // console.log("value", value);
  }, [value])

  const handleData = async () => {
     
    const res = await api.user.list()
    // console.log(res)
    if(res.status == 200){
      setdata(res.data)
      
      const _children = []
      for (let i = 0; i < res.data.length; i++) {
        _children.push(<Option {...res.data[i]} key={res.data[i]._id}>{res.data[i].name}</Option>);
      }

      setdataOption(_children)
    }
  }

  useEffect(() => {
    handleData()
  }, [])

  return (
    <Select
      mode="tags"
      style={{
        width: '100%',
      }}
      placeholder={placeholder ? placeholder : "Chọn người dùng"}
      onChange={setValue}
      value={value}
    >
      {dataOption}
    </Select>
  )
};
export default UserSelect;