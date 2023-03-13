const express=require('express')
const multer = require('multer')
const {val_create_student}=require('../validation/student_validation')
const {upload,file_upload} =require('../middlewares/upload')
const {Response} = require('../helpers/helper')
const router =  express.Router()
const {authentication} = require('../middlewares/authorization')
const {student_id_exist} = require('../middlewares/student_exists')
const {dpt_id_exist} = require('../middlewares/department_exist')
const {add,get_students,get_student_by_id,verify_otp,student_login,update_students,get_image,delete_students,get_students_with_dpt,student_image}=require('../app/controllers/students_control')
// const{student_login}=require('../app/controllers/student/login')
router.post('/add-students',(req,res,next)=>{
    console.log("dcdcscdscscss")
    upload(req, res,(err)=> {
      if (err instanceof multer.MulterError) {
        console.log("ERROR")
        res.status(400).json(Response.error(err.message))
      } else if(err){
        console.log("UPLOaded")
        res.status(400).json(Response.error(err.message))
        // console.log(req.files)
      }
      next()
    })
  }
  ,val_create_student,dpt_id_exist,add)
router.get('/get-students',get_students)
router.post('/get-student-by-id',val_create_student,student_id_exist,get_student_by_id)
router.post('/update-student',dpt_id_exist,student_id_exist,val_create_student,update_students)
router.post('/delete-students',val_create_student,student_id_exist,delete_students)
router.post('/student-dpt',get_students_with_dpt)
router.post('/student-img',student_image)
router.post('/get-img',get_image)
router.post('/st-login',student_login)
router.get('/verify-otp/:email/:code',verify_otp)
router.get('/view-result',authentication,)
module.exports =router