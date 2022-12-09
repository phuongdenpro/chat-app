
import store, { setPage, setStoreCurentConv } from "../store/store"
import api from "./apis"

export const mess = async (userId) => {
    const res = await api.conversation.create_1vs1({ userId: userId })
    // console.log("createConversation1vs1", res)
    if (res.data.isExists) {
        const res2 = await api.conversation.get(res.data._id)
        // console.log("createConversation1vs1 2222222222222", res2.data)

        store.dispatch(setPage("conversation"))
        store.dispatch(setStoreCurentConv(res2.data))
    } else {
        store.dispatch(setPage("conversation"))
        store.dispatch(setStoreCurentConv(res.data))
    }
}