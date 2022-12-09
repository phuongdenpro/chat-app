
export const deleteConversation = async (conversation_id, on_success) => {
    // try{
    //     const res = await api.conversation.create_group(values)
    //     // console.log("createConversation", res)
    //     if(res.status == 201){
    //       message.success("Tạo nhóm thành công")
    //       setOpen(false)
    //       // props.setCurrentConv()
    //     }
    //   }catch(err){
    //     // console.log("Failed, ", err)
    //   }
    on_success()
}
