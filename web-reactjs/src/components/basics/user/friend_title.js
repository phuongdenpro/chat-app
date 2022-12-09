import { Input, Typography } from "antd";

const FriendTitle = ({title, placeholder, onSearch}) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between'
        }}>
            <Typography.Title level={4} style={{marginBottom: '20px'}}>{title}</Typography.Title>
            <div>
                <Input placeholder={placeholder} onChange={(e) => onSearch(e.target.value)}/>
            </div>
        </div>
    )
}

export default FriendTitle;