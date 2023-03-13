const mongoose = require('mongoose')

const {Schema}=require('mongoose')


const dpt = new Schema({
    sem:{
        type:String,
        uniquie:true,
        required:true
    },
    department:{
        type:Schema.Types.ObjectId,
        ref:"departments"
    },
    Subjects:{
        type:Array,
        required:true,
        unique:false
    }
})
module.exports.Semester=mongoose.model("semester",dpt)
