import { Button, Col, Input, message, Progress, Row, Space, Upload } from 'antd';
import React, { useState } from 'react';
import {
    SendOutlined, FileImageOutlined, FileZipOutlined
} from '@ant-design/icons';
import { getBase64 } from '../../utils/utils';
import api from '../../utils/apis';
const { TextArea } = Input;



const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === "video/mp3" || file.type === "video/mp4";
    if (!isJpgOrPng) {
        message.error('Vui lòng chọn file ảnh hoặc video!');
    }

    return isJpgOrPng;
};


const MessageSection = (props) => {
    const [value, setValue] = useState("")
    const [progressPercent, setProgressPercent] = useState(0)
    const [showProgress, setShowProgress] = useState(false)

    const handleChange = async (info) => {
        if (info.file.status === 'done') {
            var data = new FormData();
            data.append('file', info.file.originFileObj);
            setShowProgress(true)
            // console.log(info)
            var TYPE = "IMAGE"
            if(info.file.type == "video/mp3" || info.file.type == "video/mp4"){
                TYPE = "VIDEO"
            }
            try{
                const res = await api.message.addMessageMedia(TYPE, props.currentConv._id, data, event => {
                    const percent = Math.floor((event.loaded / event.total) * 100);
                    // console.log(percent)
                    setProgressPercent(percent)
                    if(percent == 100){
                        setTimeout(() => {
                            setShowProgress(false)
                            setProgressPercent(0)
                        }, 500)
                    }
                })
            }catch{
                message.error("Có lỗi xảy ra!")
                setShowProgress(false)
                setProgressPercent(0)
            }
        }
    };

    const handleChangeFile = async (info) => {
        if (info.file.status === 'done') {
            // console.log("handleChangeFile", info)
            var data = new FormData();
            data.append('file', info.file.originFileObj);
            setShowProgress(true)
            try{
                const res = await api.message.addMessageMedia("FILE", props.currentConv._id, data, event => {
                    const percent = Math.floor((event.loaded / event.total) * 100);
                    // console.log(percent)
                    setProgressPercent(percent)
                    if(percent == 100){
                        setTimeout(() => {
                            setShowProgress(false)
                            setProgressPercent(0)
                        }, 500)
                    }
                })
                // console.log(res)
            }catch{
                message.error("Có lỗi xảy ra!")
                setShowProgress(false)
                setProgressPercent(0)
            }
        }
    };

    return (
        <div>
            <Progress 
                showInfo={false}
                strokeWidth="5px"
                strokeLinecap="butt" 
                percent={progressPercent} 
                style={{
                    transform: 'translateY(6px)',
                    display: `${showProgress ? 'block' : 'none'}`
                }}/>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                backgroundColor: '#FFFFFF'
            }}>
                <div style={{
                    flex: 'auto'
                }}>
                    {/* <TextArea rows={2}
                        style={{
                            border: 'none',
                            resize: 'none'
                        }}
                        placeholder="Nhập tin nhắn"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onPressEnter={() => {
                            props.sendMessage(value)
                            setTimeout(() => setValue(""), 100)
                        }} /> */}
                    
                    <Input rows={2}
                        style={{
                            border: 'none',
                            resize: 'none',
                            height: '100%'
                        }}
                        placeholder="Nhập tin nhắn"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onPressEnter={() => {
                            props.sendMessage(value)
                            setTimeout(() => setValue(""), 100)
                        }} />
                </div>
                <div style={{
                    padding: '10px'
                }}>
                    <Space>
                        <Upload
                            name="avatar"
                            accept='image/jpeg,image/png,video/mp3,video/mp4'
                            showUploadList={false}
                            customRequest={(options) => {
                                // console.log(options)
                                options.onSuccess(options)
                            }}
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                        >
                            <Button key="image" type="text" icon={<FileImageOutlined />} />
                        </Upload>
                        <Upload
                            accept='application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.rar,application/zip'
                            showUploadList={false}
                            customRequest={(options) => {
                                // console.log(options)
                                options.onSuccess(options)
                            }}
                            // beforeUpload={beforeUpload}
                            onChange={handleChangeFile}
                        >
                            <Button key="image" type="text" icon={<FileZipOutlined />} />
                        </Upload>
                        <Button key="text" type="text" icon={<SendOutlined />}
                            onClick={() => {
                                if (value != "" && value != "\n") {
                                    props.sendMessage(value)
                                    setValue("")
                                }
                            }} />
                    </Space>
                </div>
            </div>
        </div>
    )
}

export default MessageSection;