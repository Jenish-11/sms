const { cache } = require('joi');
const joi =require('joi')
const{Students}=require('../app/models/students');
const { requir_ } = require('../helpers/helper');
const {Response}=require('../helpers/helper')
joi.objectId = require('joi-objectid')(joi);
var error =[]
module.exports.val_create_student = (req,res,next) =>{
var validation;
try {
    // console.log(req.body);
    if(req.path=='/add-students'){
      validation = joi.object({
        email:joi.string()
        .email()
        .case("lower")
        .required(),    
        phone_number:joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .required(),
        name:joi.string().required(),
        address:joi.object({
                line1:joi.string().required(),
                line2:joi.string().required(),
                district:joi.string().required(),
                pin:joi.string().required().length(6).pattern(/^[0-9]+$/),
                state:joi.string().required(),
                country:joi.string().required(),
            }),
        father_name:joi.string().required(),
        mother_name:joi.string().required(),
        gender:joi.string().required().valid('M', 'F'),
        department:joi.objectId(),
        semester:joi.string().required().length(1).pattern(/^[0-9]+$/),
        photo:joi.string().domain()
    })
}
else if(req.path=='/update-student'){
    validation = joi.object({
        student_id:joi.objectId().required(),
        email:joi.string()
        .email()
        .case("lower")
        ,    
        phone_number:joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        ,
        name:joi.string(),
        address:joi.object({
                line1:joi.string(),
                line2:joi.string(),
                district:joi.string(),
                pin:joi.string().length(6).pattern(/^[0-9]+$/),
                state:joi.string(),
                country:joi.string(),
            }),
        father_name:joi.string(),
        mother_name:joi.string(),
        gender:joi.string().valid('M','F'),
        semester:joi.string().length(1).pattern(/^[0-9]+$/),
        photo:joi.string().domain()
    })

}
else if(req.path=='/delete-students'||req.path=='/get-student-by-id'){
    validation = joi.object({
        student_id:joi.string().required()
    })
}
else if(req.path=='/add-dpt'){
    validation = joi.object({
        name:joi.string().required(),
        steam:joi.string().required(),
        dpt_code:joi.string().required(),
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
    res.status(403).send("gg");
    console.log("hi")
}
}