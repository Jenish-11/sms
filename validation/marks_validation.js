const { Response } = require("../helpers/helper");
const joi = require("joi");
const { Semester } = require("../app/models/semester");
joi.objectId = require("joi-objectid")(joi);
module.exports.val_marks = async (req, res, next) => {
  var validation;
  try {
    if (req.path == "/create-mark") {
      validation = joi.object({
        student_id: joi.objectId(),
        semester_id: joi.objectId(),
      });
    }
    if (req.path == "/give-mark") {
      validation = joi.object({
        marks: joi.array().items(
          joi.object({
            subject_id: joi.objectId(),
            grade: joi.number().max(100),
          })
        ),
        mark_id: joi.objectId(),
      });
    }
    if (req.path == "/get-mark") {
      validation = joi.object({
        semester_id: joi.objectId().required(),
        student_id: joi.objectId().required(),
      });
    }

    const { error, value } = validation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const e_msg = error.details.map((e) => e.message);
      res.status(403).json(Response.error(e_msg));
    } else {
      req.body = value;
      next();
    }
  } catch (e) {
    res.status(403).json(Response.error(e.message));
    console.log("hi");
  }
};
