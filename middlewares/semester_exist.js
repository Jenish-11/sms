const { Semester } = require("../app/models/semester");
const { Response } = require("../helpers/helper");





module.exports.semester_exist = async (req,res,next)=>{
    const id = req.query.id 
    let sem;
    try{
    if(id){
        sem=await Semester.findOne({_id:id}).exec()
        if(sem){
            return next()
        } 
        else{
          return  res.status(400).json(Response.error("id not exit"))
        }
    }
     next()
}catch(e){
    return res.status(400).json(Response.error(e.message))
}
}