const express = require("express");
const router = express.Router();
const { add_dpt, get_dpt } = require("../app/controllers/departments");
const { val_create_student } = require("../validation/student_validation");

router.post("/add-dpt", val_create_student, add_dpt);
router.get("/get-dpt", get_dpt);

module.exports = router;
