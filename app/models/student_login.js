const mongoose = require('mongoose')

const {Schema}=require('mongoose')


const login = new Schema({
    student_id:{
        type:Schema.Types.ObjectId,
        required:true
    },
    token:{
        type:String,
        required:true
    },
    ip:{
        type:String,
        required:true
    },
    user_agent:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:false
    }
},{timestamps:true})
module.exports.St_login=mongoose.model("st_login",login)
