import { Button, Space } from "antd";
import {
    LikeOutlined,
    HeartOutlined,
    SmileOutlined,
    FrownOutlined,
} from "@ant-design/icons";

const ReactPane = ({item, onReact}) => {
    return (
        <div>
            <Space size="small">
                <Button type="text" size="small" onClick={() => onReact(1)}>
                    <img style={{ width: '20px' }} src={require("../../../assets/like.png")}/>
                </Button>
                <Button type="text" size="small" onClick={() => onReact(2)}>
                    <img style={{ width: '20px' }} src={require("../../../assets/love.png")}/>
                </Button>
                <Button type="text" size="small" onClick={() => onReact(3)}>
                    <img style={{ width: '20px' }} src={require("../../../assets/haha.png")}/>
                </Button>
                <Button type="text" size="small" onClick={() => onReact(4)}>
                    <img style={{ width: '20px' }} src={require("../../../assets/wow.png")}/>
                </Button>
                <Button type="text" size="small" onClick={() => onReact(5)}>
                    <img style={{ width: '20px' }} src={require("../../../assets/sad.png")}/>
                </Button>
                <Button type="text" size="small" onClick={() => onReact(6)}>
                    <img style={{ width: '20px' }} src={require("../../../assets/angry.png")}/>
                </Button>
            </Space>
        </div>
    )
}

export default ReactPane;