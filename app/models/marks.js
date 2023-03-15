const mongoose = require('mongoose')

const {Schema}=require('mongoose')
const { Semester } = require('./semester')
const { Students } = require('./students')


const mark = new Schema({

    student_id:{
        type:Schema.Types.ObjectId,
        ref:"students"
    },
    semester_id:{
        type:Schema.Types.ObjectId,
        ref:"semesters"
    },
    marks:[{
        subject_id:{
            type :Schema.Types.ObjectId,
            unique:true,
            ref:"subjects"
        },
        grade:{
            types:String,
            enum:["A","B","C","D","E","O"]
        }
    }],
    
},{timestamps:true})

mark.pre('save',async function(next){
    try {
        console.log("THIS",this.student_id);
        const st = await Students.findOne({_id:new mongoose.Types.ObjectId(this.student_id)}).exec()
        const sem = await Semester.findById(this.semester_id)
        // .lookup({
        //         from: 'subjects',
        //         localField: 'subjects',
        //         foreignField: '_id',
        //         as: 'subject_details',
        // }).exec()
        console.log("ST",st.department);
        console.log("SEM",sem.department);
        if(st.department.toString()!=sem.department.toString()){
            const error = new Error('department id not matching');
            return next(error)
        }
        if(this.marks.length==sem.subjects){
            for (const sub of sem.subjects) {
                this.marks.push({subject_id:sub})
            }
        }
            console.log("NEXT");
            return next();
    
    } catch (e) {
        next(e)
    }
   
})
const Mark=mongoose.model("marks",mark)
module.exports = {Mark}