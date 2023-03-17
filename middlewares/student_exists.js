const{Response}=require('../helpers/helper')
const{Students} = require('../app/models/students')
module.exports.student_id_exist=async(req,res,next)=>{
    try{
    const student_id = req.body.student_id
    const idExists =await Students.findById(student_id).exec()
    if(idExists){
    next()
    }
    else{
       return res.status(400).json(Response.error("student Id not Exist"))
    }
}
catch(e){
   return res.status(400).json(Response.error("student Id not Exist"))
}
}


