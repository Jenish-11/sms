const mongoose = require('mongoose')

const {Schema}=require('mongoose')
const { Students } = require('./students')


const subjects = new Schema({
    name:{
        type:String,
        unique:[true,"name already exits"],
        required:true,
    }
},{timestamps:true})
const Subject=mongoose.model("subjects",subjects)


// subjects.pre('save',((next) => {

//     Subject.save((err) => {
//         if (err) {
//             console.log(err)
//           next(err); // outputs: "User validation failed: age: Age is required."
//         }})
// }))
module.exports={
    Subject
}