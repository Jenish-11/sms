const{Response}=require('../helpers/helper')
const{Students} = require('../app/models/students')
module.exports.student_id_exist=async(req,res,next)=>{
    try{
    console.log(req.body.id)
    const idExists =await Students.findById(req.body.id).exec()
    if(idExists){
    next()
    }
    else{
        res.status(400).json(Response.error("student Id not Exist"))
    }
}
catch(e){
    res.status(400).json(Response.error("student Id not Exist"))
}
}


