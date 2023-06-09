const express=require('express')
const multer = require('multer')
const {val_create_student}=require('../validation/student_validation')
const {upload,file_upload} =require('../middlewares/upload')
const {Response} = require('../helpers/helper')
const router =  express.Router()
const {authentication} = require('../middlewares/authorization')
const {student_id_exist} = require('../middlewares/student_exists')
const {dpt_id_exist} = require('../middlewares/department_exist')
const {add,get_students,get_student_by_id,update_students,get_image,delete_students,get_students_with_dpt,student_image}=require('../app/controllers/students_control')
const { verify_otp, student_login } = require('../app/controllers/student/login')
// const}=require('../app/controllers/student/login')
router.post('/add-students',upload.any(),file_upload,val_create_student,dpt_id_exist,add)
router.get('/get-students/:item?',get_students)
router.post('/get-student-by-id',val_create_student,student_id_exist,get_student_by_id)
router.post('/update-student',upload.any(),file_upload,val_create_student,student_id_exist,update_students)
router.post('/delete-students',val_create_student,student_id_exist,delete_students)
// router.post('/student-dpt',get_students_with_dpt)
// router.post('/student-img',student_image)
// router.post('/get-img',get_image)
router.post('/st-login',student_login)
router.post('/verify-otp',verify_otp)
router.get('/view-result',authentication,)
module.exports =router