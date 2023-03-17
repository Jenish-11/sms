const express=require('express')
const multer = require('multer')
const { create_marks, give_marks, get_marks, filter_marks } = require('../app/controllers/marks_control')
const { create_subject, get_subject } = require('../app/controllers/subjects_control')
const {Response} = require('../helpers/helper')
const router =  express.Router()
const {authentication} = require('../middlewares/authorization')
const {dpt_id_exist} = require('../middlewares/department_exist')
const { mark_id_exist } = require('../middlewares/marks_id_exit')
const { semester_exist } = require('../middlewares/semester_exist')
const { student_id_exist } = require('../middlewares/student_exists')
const { val_marks } = require('../validation/marks_validation')

// const{student_login}=require('../app/controllers/student/login')
router.post('/create-mark',val_marks,student_id_exist,semester_exist,create_marks)
router.post('/give-mark',val_marks,mark_id_exist,give_marks)
router.post('/get-mark',val_marks,student_id_exist,semester_exist,get_marks)
router.post('/filter-mark',filter_marks)


module.exports= router
