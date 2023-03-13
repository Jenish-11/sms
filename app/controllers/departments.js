const {Dpt}=require('../models/department')
const joi = require('joi')
const { Response } = require('../../helpers/helper')

module.exports.add_dpt=(req,res)=>{
    try{
    Dpt.create(req.body).then((s)=>res.json(Response.success(s))).catch((err)=>res.status(400).json(Response.error(err.message)))
}catch(e){
    res.status(400).json(e.message)
}
}
