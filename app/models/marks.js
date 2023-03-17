const mongoose = require('mongoose')

const {Schema}=require('mongoose')
const { Semester } = require('./semester')
const { Students } = require('./students')


const mark = new Schema({

    student_id:{
        type:Schema.Types.ObjectId,
        ref:"student",
    },
    semester_id:{
        type:Schema.Types.ObjectId,
        ref:"semesters",
    },
    result:[{
        subject_id:{
            type :Schema.Types.ObjectId,
            ref:"subjects"
        },
        grade:{
            type:Number,
            default:0,
        }
    }],
    
},{timestamps:true})

mark.pre('save',async function(next){
    try {
        console.log("THIS",this.student_id);
        const st = await Students.findOne({_id:new mongoose.Types.ObjectId(this.student_id)}).exec()
        const sem = await Semester.findById(this.semester_id)
        console.log("ST",st.department);
        console.log("SEM",sem.department);
        if(st?.department?.toString()!=sem?.department.toString()){
            const error = new Error('department id not matching');
            return next(error)
        }
        if(this.result.length==0){
            for (const sub of sem.subjects) {
                this.result.push({subject_id:sub})
            }
            return next();
        }
            console.log("NEXT");
            return next();
    
    } catch (e) {
        next(e)
    }
   
})
const Mark=mongoose.model("marks",mark)
module.exports = {Mark}