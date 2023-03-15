const Response = {
    error(error, message='error') {
        return { success: false, message, error }
    },

    success(data, message='success') {
        return { success: true, message, data }
    }
}
const requir_ =(req)=>{
    // console.log(req.path);
    req.path=='/update-student'?undefined:required()
}

// const Response = {
//     error(error,res, message='error') {
//         return res.status(400).json({success: false, message, error})
//     },

//     success(data, message='success') {
//         return { success: true, message, data }
//     }
// }
// const requir_ =(req)=>{
//     // console.log(req.path);
//     req.path=='/update-student'?undefined:required()
// }


module.exports={
    Response,
    requir_,
}