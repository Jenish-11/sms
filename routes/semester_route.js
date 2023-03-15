const express=require('express')
const multer = require('multer')
const {Response} = require('../helpers/helper')
const router =  express.Router()
const {authentication} = require('../middlewares/authorization')
const {dpt_id_exist} = require('../middlewares/department_exist')
const { create_semester, get_semester } = require('../app/controllers/semesters_control')
const { val_semester } = require('../validation/semester_validation')
const { semester_exist } = require('../middlewares/semester_exist')

// const{student_login}=require('../app/controllers/student/login')
router.post('/create-semester',val_semester,dpt_id_exist,create_semester)
router.get('/get-semester',semester_exist,get_semester)


module.exports= router
