const{Response}=require('../helpers/helper')
const{Dpt} = require('../app/models/department')
const { Semester } = require('../app/models/semester')
const {mongoose} = require('mongoose')
const { Subject } = require('../app/models/subjects')
module.exports.dpt_id_exist=async(req,res,next)=>{
    const item=req.body
    console.log(item)
    try{
    const idExists =await Dpt.findById(req.body.department)
    if(idExists||!req.body.department){
        req.body.dpt=idExists
        if(req.body.sem){
            const semExists =await Semester.aggregate().match({$and:[{sem:item.sem},{department:new mongoose.Types.ObjectId(item.department)},]})
            if(semExists.length!=0){
                return res.status(400).json(Response.error("semester already exists"))
            }
        }
        if(req.body.subjects){
            for (const iterator of item.subjects) {
                 var sub = await Subject.findById({_id:iterator})
                 if(!sub){
                    return res.json(Response.error(`check ${iterator}`))
                 }
            }
        }
    next()
    }
    else{
       return res.status(400).json(Response.error("department Id not Exist"))
    }
}
catch(e){
   return res.status(400).json(Response.error(e.message))
}
}


