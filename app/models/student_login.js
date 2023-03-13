const mongoose = require('mongoose')

const {Schema}=require('mongoose')


const login = new Schema({
    email:{
        type:String,
        uniquie:true,
        required:true
    },
    confirmation_code:{
        type:String,
        unique:true,
        required:true
    },
    ip:{
        type:String,
        unique:true,
        required:true
    },
    user_agent:{
        type:String,
        unique:true,
        required:true
    },
    status:{
        type:Boolean,
    }
})
module.exports.St_login=mongoose.model("st_login",login)
