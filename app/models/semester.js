const mongoose = require('mongoose')

const {Schema}=require('mongoose')


const semester = new Schema({
    sem:{
        type:Number,
        uniquie:true,
        required:true,
        enum:[1,2,3,4,5,6,7,8]
    },
    department:{
        type:Schema.Types.ObjectId,
        ref:"departments"
    },
    subjects:[{ 
        type :Schema.Types.ObjectId, ref: 'subjects' 
    }],
},{timestamps:true})
module.exports.Semester=mongoose.model("semester",semester)
