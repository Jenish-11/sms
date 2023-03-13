const{Response}=require('../helpers/helper')
const{Dpt} = require('../app/models/department')
module.exports.dpt_id_exist=async(req,res,next)=>{
    try{
    // console.log(req.body.department)
    const idExists =await Dpt.findById(req.body.department).exec()
    if(idExists||!req.body.department){
        req.body.dpt=idExists
    next()
    }
    else{
        res.status(400).json(Response.error("department Id not Exist"))
    }
}
catch(e){
    res.status(400).json(Response.error("department Id not Exist"))
}
}


