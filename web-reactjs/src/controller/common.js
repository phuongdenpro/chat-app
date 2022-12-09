// export const callApi = async (on_success, on_error, on_fail) => {
//     try {
//         const res = await api.friend.get_invites()
//         if(res.status == 200){
//             return on_success(res)
//         }
//         on_fail ? on_fail(res) : null
//         return false
//     } catch (err) {
//         // console.log("Failed, ", err)
//         on_error ? on_error(err) : null
//     }
// }