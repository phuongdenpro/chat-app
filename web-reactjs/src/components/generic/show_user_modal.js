import { useState } from "react"
import UserViewModal from "../components/basics/user/user_view_modal"

export const ShowUserViewModal = ({info, ref}) => {
    const [openUserModal, setOpenUserModal] = useState(false);

    const showModal = () => {
        setOpenUserModal(true)
    }
    
    const hideModal = () => {
        setOpenUserModal(false)
    }

    return <UserViewModal openUserModal={openUserModal} setOpenUserModal={setOpenUserModal} info={info}/>
}