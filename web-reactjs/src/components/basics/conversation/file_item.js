import { Button, Typography } from "antd"
import {
    DownloadOutlined
  } from "@ant-design/icons";
import { truncate_middle } from "../../../utils/utils";
import { useEffect, useState } from "react";
import { isFulfilled } from "@reduxjs/toolkit";
const wordIcon = "https://cdn-icons-png.flaticon.com/512/4725/4725970.png";
const pdfIcon = "https://cdn-icons-png.flaticon.com/512/4726/4726010.png";
const pptIcon = "https://cdn-icons-png.flaticon.com/512/4726/4726016.png";
const zipIcon = "https://cdn-icons-png.flaticon.com/512/4726/4726042.png";
const fileIcon = "https://cdn-icons-png.flaticon.com/512/4726/4726038.png";


const FileType = ({name}) => {
  const [icon, setIcon] = useState("")

  useEffect(() => {
    if(name){
      if(name.endsWith("doc") || name.endsWith("docx")){
        setIcon(wordIcon);
      }else if(name.endsWith("pdf")){
        setIcon(pdfIcon);
      }else if(name.endsWith("ppt") || name.endsWith("pptx")){
        setIcon(pptIcon);
      }else if(name.endsWith("zip") || name.endsWith("rar")){
        setIcon(zipIcon);
      }else{
        setIcon(fileIcon);
      }
    }
  }, [name])

  return (
    <img src={icon} style={{
      width: '40px',
      marginRight: '10px'
    }}/>
  )
}

const FileItem = ({item}) => {

    const arr = item?.content.split("/")
    const nametmp = arr[arr.length-1]
    const name = nametmp.substr(23, nametmp.length)
    return (
        <Button
          type="text"
          href={item?.content}
          target="blank"
          // icon={<DownloadOutlined />}
          style={{
            width: '100%', 
            textAlign: 'left', 
            padding: '0', 
            marginBottom: '10px', 
            marginRight: '10px'
          }}
        >
          <FileType name={name}/> 
          <Typography.Text>{" "+truncate_middle(name, 20, 10)}</Typography.Text>

          
        </Button>
    )
}

export default FileItem