const {Response}=require('../helpers/helper')
const joi =require('joi')
joi.objectId = require('joi-objectid')(joi);
module.exports.val_semester = (req,res,next) =>{
    var validation;
    try {
        // console.log(req.body);
        if(req.path=='/create-semester'){
          validation = joi.object({
            sem:joi.number().required().valid(1,2,3,4,5,6,7,8),
            department:joi.objectId().required(),
            subjects:joi.array().unique().required()
        })
    }
   
       const {error,value} = validation.validate(req.body,{ abortEarly: false })
       if(error){
        const e_msg = error.details.map((e)=>e.message)
        res.status(403).json(Response.error(e_msg))
       }
       else{
        
        req.body=value
        next()
       }
    } 
    catch(e) {
        res.status(403).json(Response.error(e.message))
        console.log("hi")
    }
    }