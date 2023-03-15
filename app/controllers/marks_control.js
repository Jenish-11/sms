
const mongoose = require('mongoose')
const joi = require('joi')
const path = require('path')
const {Response}=require('../../helpers/helper')
const { Subject } = require('../models/subjects')
const  x = require('../models/marks')



const create_marks=async(req,res,next)=>{
    const body=req.body
    const student_id=new mongoose.Types.ObjectId(body.student_id)
    const semester_id=new mongoose.Types.ObjectId(body.semester_id)
    console.log("BODY",body);
    try{
       const s = await x.Mark.create({student_id,semester_id,})
        return res.json(Response.success(s))
   } 
    catch(e){
        console.log(e)
       return res.status(400).json(Response.error(e.code==11000?"student already exits":e.message))
    }}

    module.exports={
        create_marks,
    }
// const give_marks=async(req,res,next)=>{
//     const body=req.body
//     console.log("BODY",body);
//     try{
//        const s = await x.Mark.updateOne({_id:body.id},{ $set: { `marks.$[${body.index}].grade`: body.grade } })
//         return res.json(Response.success(s))
//    } 
//     catch(e){
//         console.log(e)
//        return res.status(400).json(Response.error(e.code==11000?"student already exits":e.message))
//     }}

    module.exports={
        create_marks,
    }