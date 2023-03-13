const mongoose = require('mongoose')

const {Schema}=require('mongoose')


const dpt = new Schema({
    name:{
        type:String,
        unique:true,
        required:true,

    },
    steam:{
        type:String,
        required:true,
        unique:false,
        enum:["Engineering","Science","Arts"]
    },
    dpt_code:{
        type:String,
        required:true,
        unique:true
    }
})
module.exports.Dpt=mongoose.model("departments",dpt)
