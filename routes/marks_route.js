const express=require('express')
const multer = require('multer')
const { create_marks } = require('../app/controllers/marks_control')
const { create_subject, get_subject } = require('../app/controllers/subjects_control')
const {Response} = require('../helpers/helper')
const router =  express.Router()
const {authentication} = require('../middlewares/authorization')
const {dpt_id_exist} = require('../middlewares/department_exist')

// const{student_login}=require('../app/controllers/student/login')
router.post('/create-mark',create_marks)
router.get('/get-mark',get_subject)

module.exports= router
