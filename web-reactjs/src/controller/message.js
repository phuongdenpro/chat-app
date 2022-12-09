import api from "../utils/apis"


export const removeMessageFromAll = async (message_id, on_success) => {
  try{
      const res = await api.message.removeMessage(message_id)
      // console.log("removeMessageFromAll", res)
      if(on_success)on_success(res)
      return true
  }catch(err){
    // console.log("Failed, ", err)
  }
}

export const deleteMessage = async (message_id, on_success) => {
    try{
        const res = await api.message.deleteMessage(message_id)
        // console.log("deleteMessage", res)
        if(on_success)on_success(res)
        return true
        
    }catch(err){
      // console.log("Failed, ", err)
    }
}