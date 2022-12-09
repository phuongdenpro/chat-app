import axiosApi from "./axios"
import Cookies from "js-cookie"

class AccountApi{
    login(params){
        const url = "/auth/login/"
        return axiosApi.post(url, params)
    }

    register(params){
        const url = "/auth/register/"
        return axiosApi.post(url, params)
    }

    forgot_password(params){
        const url = "/auth/forgot_password/"
        return axiosApi.post(url, params)
    }

    forgot_password_verify(params){
        const url = "/auth/forgot_password/verify/"
        return axiosApi.post(url, params)
    }

    change_password(params){
        const url = "/auth/change_password/"
        return axiosApi.post(url, params)
    }

    get_info(params){
        const url = "/auth/get_info/"
        return axiosApi.get(url, params)
    }

    save_token(response){
        Cookies.set(
            "access",
            response.data.accessToken
        );
        Cookies.set(
            "refresh",
            response.data.refreshToken
        );
    }

    save_info(response){
        Cookies.set("_id", response.data._id);
        Cookies.set("name", response.data.name);
        Cookies.set("phoneNumber", response.data.phoneNumber);
        Cookies.set("dateOfBirth", response.data.dateOfBirth);
        Cookies.set("gender", response.data.gender);
        Cookies.set("avatar", response.data.avatar);
        Cookies.set("isDeleted", response.data.isDeleted);
        Cookies.set("isAdmin", response.data.isAdmin);
        Cookies.set("createdAt", response.data.createdAt);
        Cookies.set("updatedAt", response.data.updatedAt);
        Cookies.set("__v", response.data.__v);
    }

    remove_token(response){
        Cookies.remove("access")
        Cookies.remove("refresh")
    }

    get_token(){
        return {
            access: Cookies.get("access"),
            refresh: Cookies.get("refresh"),
        }
    }
}

const getApi = (resource, extras) => {
    return {
        ...extras,
        list: (params) => {
            const url = `/${resource}/`
            return axiosApi.get(url, params)
        },
        get: (id, params) => {
            const url = `/${resource}/${id}/`
            return axiosApi.get(url, params)
        },
        add: (params) => {
            const url = `/${resource}/`
            return axiosApi.post(url, params)
        },
        update: (id, params) => {
            const url = `/${resource}/${id}/`
            return axiosApi.put(url, params)
        },
        delete: (id, params) => {
            const url = `/${resource}/${id}/`
            return axiosApi.delete(url, params)
        }
    }
}

// const addMessageMedia = async () => {

// }

const api = {
    user: getApi("user", {
        get_info: (params) => {
            const url = `/user/`
            return axiosApi.get(url, params)
        },
        update_avatar: (params) => {
            const url = `/me/avatar`
            return axiosApi.patch(url, params)
        },
        update_info: (params) => {
            const url = `/me/profile`
            return axiosApi.put(url, params)
        },
        get_profile: (params) => {
            const url = `/me/profile`
            return axiosApi.get(url, params)
        },
        change_password:(params)=>{
            const url = `/me/password`
            return axiosApi.patch(url, params)
        },
        getUserByPhoneNumber:(phoneNumber, params) =>{
            const url = `/user/phonenumber/${phoneNumber}`
            return axiosApi.get(url, params);
        },
        update_password:(user_id, params)=>{
            const url = `/user/password/${user_id}`
            return axiosApi.put(url, params);
        }
    }),

    friend: getApi("friends", {
        cancelFriend: (user_id, params) => {
            const url = `/friends/${user_id}`
            return axiosApi.delete(url, params)
        },
        invite: (user_id, params) => {
            const url = `/friends/invites/me/${user_id}`
            return axiosApi.post(url, params)
        },
        get_invites: (params) => {
            const url = `/friends/invites`
            return axiosApi.get(url, params)
        },
        accept: (sender_id, params) => {
            const url = `/friends/${sender_id}`
            return axiosApi.post(url, params)
        },
        decline: (sender_id, params) => {
            const url = `/friends/invites/${sender_id}`
            return axiosApi.delete(url, params)
        },
        get_invites_by_me: (params) => {
            const url = `/friends/invites/me`
            return axiosApi.get(url, params)
        },
        remove_invite: (userId, params) => {
            const url = `/friends/invites/me/${userId}`
            return axiosApi.delete(url, params)
        }
    }),

    conversation: getApi("conversation", {
        create_1vs1: (params) => {
            const url = `/conversation`
            return axiosApi.post(url, params)
        },
        create_group: (params) => {
            const url = `/conversation/groups`
            return axiosApi.post(url, params)
        },
        get_last_view: (id, params) => {
            const url = `/conversation/${id}/last-view`
            return axiosApi.post(url, params)
        },
        leave_group: (id, params) => {
            const url = `/conversation/${id}/members/leave`
            return axiosApi.delete(url, params)
        },
        rename: (id, params) => {
            const url = `/conversation/${id}/name`
            return axiosApi.patch(url, params)
        },
        list_member: (id, params) => {
            const url = `/conversation/${id}/members`
            return axiosApi.get(url, params)
        },
        update_avatar: (id, params) => {
            const url = `/conversation/${id}/avatar`
            return axiosApi.patch(url, params)
        },
        delete_all_message: (id, params) => {
            const url = `/conversation/${id}/messages`
            return axiosApi.delete(url, params)
        },
        delete_group: (id, params) => {
            const url = `/conversation/${id}`
            return axiosApi.delete(url, params)
        },
        kick_member: (id, user_id, params) => {
            const url = `/conversation/${id}/members/${user_id}`
            return axiosApi.delete(url, params)
        },
        add_manager: (id, params) => {
            const url = `/conversation/${id}/managers`
            return axiosApi.post(url, params)
        },
        delete_manager: (id, params) => {
            const url = `/conversation/${id}/managers/leave`
            return axiosApi.post(url, params)
        },
        add_member: (id, params) => {
            const url = `/conversation/${id}/members`
            return axiosApi.post(url, params)
        }
    }),

    message: getApi("message", {
        addMessageText: (params) => {
            const url = `/message/text`
            return axiosApi.post(url, params)
        },
        addMessageMedia: (type, conversationId, params, onUploadProgress) => {
            const url = `/message/file/${type}/${conversationId}`
            return axiosApi.post(url, params, {
                onUploadProgress: onUploadProgress
            })
        },
        removeMessage: (message_id, params) => {
            const url = `/message/${message_id}`
            return axiosApi.delete(url, params)
        },
        deleteMessage: (message_id, params) => {
            const url = `/message/${message_id}/only`
            return axiosApi.delete(url, params)
        },
        addReact: (message_id, type, params) => {
            const url = `/message/${message_id}/reacts/${type}`
            return axiosApi.post(url, params)
        }
    })
}

export {AccountApi};
export default api;