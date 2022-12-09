import api from "../utils/apis"

export const getInvites = async (on_success, on_error, on_fail) => {
    try {
        const res = await api.friend.get_invites()
        if(res.status == 200){
            if(on_success)on_success(res)
            return true
        }
        if(on_fail)on_fail(res)
        return false
    } catch (err) {
        // console.log("Failed, ", err)
        if(on_error)on_error(err)
        return false
    }
}

export const acceptInvite = async (sender_id, on_success, on_error, on_fail) => {
    try {
        const res = await api.friend.accept(sender_id)
        // console.log("acceptInvite", res)
        if(res.status == 201){
            if(on_success)on_success(res)
            return true
        }
        if(on_fail)on_fail(res)
        return false
    } catch (err) {
        // console.log("Failed, ", err)
        if(on_error)on_error(err)
        return false
    }
}

export const declineInvite = async (sender_id, on_success, on_error, on_fail) => {
    try {
        const res = await api.friend.decline(sender_id)
        // console.log("declineInvite", res)
        if(on_success)on_success(res)
        return true
    } catch (err) {
        // console.log("Failed, ", err)
        if(on_error)on_error(err)
        return false
    }
}

export const deleteFriend = async (user_id, on_success, on_error, on_fail) => {
    try {
        const res = await api.friend.delete(user_id)
        if(on_success)on_success(res)
        return true
    } catch (err) {
        // console.log("Failed, ", err)
        if(on_error)on_error(err)
        return false
    }
}