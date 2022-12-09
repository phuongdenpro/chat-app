import { Button, Modal, Image, Avatar, Typography, Space, message } from 'antd';
import React, { useEffect, useState } from 'react';
import {
    MessageOutlined, CheckOutlined, CloseOutlined, CameraOutlined
} from '@ant-design/icons';
import store from '../../../store/store'
import { get_info_from_cookie } from '../../../utils/utils';
import Cookies from 'js-cookie';
import UserEditModal from './user_edit_modal';
import api from '../../../utils/apis';

const UserUpdateAvatarModal = ({ openUpdateAvatarModal, setOpenUpdateAvatarModal, info, file }) => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});
    const [imagePreview, setImagePreview] = useState("");
    
    const showModal = () => {
        setOpenUpdateAvatarModal(true);
    };

    const handleOk = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setOpenUpdateAvatarModal(false);
        }, 3000);
    };


    const handleCancel = () => {
        setOpenUpdateAvatarModal(false);
    };

    useEffect(() => {
        setUser(info)
    }, [info])

    useEffect(() => {
        // console.log("useEffect", file)
        if(file)
            onPreview(file.file)
    }, [file])

    // useEffect(() => {
    //     store.subscribe(() => {
    //         // console.log("on change user", store.getState().user.info)
    //         if(user.name == undefined){
    //             setUser(store.getState().user.info)
    //         }
    //     })
    // }, [])

    const updateAvatar = async () => {
        var data = new FormData();
        data.append('file', file.file.originFileObj);
        // setShowProgress(true)
        // // console.log(info)
        try{
            const res = await api.user.update_avatar(data)
            // console.log(res)
            message.success("Cập nhật ảnh đại diện thành công!")
            setOpenUpdateAvatarModal(false)
            Cookies.set("avatar", res.data.avatarUrl);
        }catch{
            message.error("Có lỗi xảy ra!")
            // setShowProgress(false)
            // setProgressPercent(0)
        }
    }

    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
          src = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj);
            reader.onload = () => resolve(reader.result);
          });
        }
        setImagePreview(src)
    };

    return (
        <>
            <Modal
                open={openUpdateAvatarModal}
                title="Cập nhật ảnh đại diện"
                onCancel={handleCancel}
                footer={[
                    <Button type='primary' key="update" onClick={updateAvatar}>
                        Cập nhật
                    </Button>,
                    <Button key="back" onClick={handleCancel}>
                        Đóng
                    </Button>
                ]}
                style={{
                    padding: '0px'
                }}
            >
                <div style={{
                    display: 'flex'
                }}>
                    <div>
                        {/* <Avatar
                            size={70}
                            src={
                                <>
                                    <Image
                                        src={imagePreview}
                                    // style={{
                                    //     width: 32,
                                    // }}
                                    />
                                </>
                            }
                        /> */}
                        <Image
                            src={imagePreview}
                        // style={{
                        //     width: 32,
                        // }}
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
};
export default UserUpdateAvatarModal;