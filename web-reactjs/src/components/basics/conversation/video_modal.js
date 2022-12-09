import React from "react";
import { Modal } from "antd";


const VideoModal = ({ visible, setVisible, item }) => {


    const showModal = () => {
        setVisible(true)
    }

    const hideModal = () => {
        setVisible(false)
    }

    return (
        <div className="App">
            <Modal
                visible={visible}
                footer={null}
                onCancel={hideModal}
                bodyStyle={{ padding: 0 }}
            >
                <video
                    src={item?.content} 
                    style={{
                        width: '100%'
                    }}
                    controls></video>
            </Modal>
        </div>
    )
}

export default VideoModal;