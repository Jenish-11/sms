const mongoose = require("mongoose");
const joi = require("joi");
const path = require("path");
const { Response } = require("../../helpers/helper");
const { Subject } = require("../models/subjects");
const { Mark } = require("../models/marks");
const lod = require("lodash");

const create_marks = async (req, res, next) => {
  try {
    const body = req.body;
    const student_id = new mongoose.Types.ObjectId(body.student_id);
    const semester_id = new mongoose.Types.ObjectId(body.semester_id);
    console.log("BODY", body);
    const mark = await Mark.findOne({ student_id, semester_id }).populate({
      path: "result",
      populate: {
        path: "subject_id",
        model: "subjects",
      },
    });
    if (mark) {
      return res.json(Response.success(mark));
    }
    const s = await (
      await Mark.create({ student_id, semester_id })
    ).populate({
      path: "result",
      populate: {
        path: "subject_id",
        model: "subjects",
      },
    });
    return res.json(Response.success(s));
  } catch (e) {
    return res.status(400).json(Response.error(e.message));
  }
};

const give_marks = async (req, res, next) => {
  try {
    const body = req.body;
    var wrong_subject = [];
    const sub = body.mar.result.map((m) => m.subject_id.toString()).sort();
    const sub2 = body.marks
      .map((m) => new mongoose.Types.ObjectId(m.subject_id).toString())
      .sort();
    sub2.every((i) => {
      let t = sub.includes(i);
      if (!t) {
        wrong_subject.push(i);
      }
    });
    if (wrong_subject[0]) {
      return res
        .status(400)
        .json(
          Response.success(
            `correct your${JSON.stringify(wrong_subject)} subject id`
          )
        );
    }
    const re = body.marks.forEach(async (m) => {
      await Mark.updateOne(
        { _id: body.mark_id },
        { $set: { "result.$[elem].grade": m.grade } },
        { arrayFilters: [{ "elem.subject_id": m.subject_id }] }
      );
    });
    const updatedResult = await Mark.findOne({ _id: body.mark_id });
    if (updatedResult) {
      let totalMarks = 0;
      updatedResult.result.forEach((subject) => {
        totalMarks += subject.grade;
      });
      await Mark.updateOne(
        { _id: body.mark_id },
        { $set: { totalMarks: totalMarks } }
      ).exec();
      await Mark.updateOne(
        { _id: body.mark_id },
        {
          $set: {
            percentage:
              (totalMarks / (updatedResult.result.length * 100)) * 100,
          },
        }
      ).exec();
    }
    return res.json(Response.success("Update Success"));
  } catch (e) {
    return res
      .status(400)
      .json(
        Response.error(e.code == 11000 ? "student already exits" : e.message)
      );
  }
};

const get_marks = async (req, res) => {
  try {
    const { student_id, semester_id } = req.body;
    var get_marks_by_student = await Mark.find({
      $and: [
        {
          student_id: new mongoose.Types.ObjectId(student_id),
        },
        { semester_id: new mongoose.Types.ObjectId(semester_id) },
      ],
    }).populate({
      path: "result",
      populate: {
        path: "subject_id",
        model: "subjects",
      },
    });
    if (!get_marks_by_student[0]) {
      throw new Error("Student with Semester Not Matching");
    }
    return res.json(Response.success(get_marks_by_student));
  } catch (e) {
    return res.status(400).json(Response.error(e.message));
  }
};

const filter_marks = async (req, res) => {
  const position = req.query.sort;
  const { department_id, semester_id, batch_of_year } = req.body;
  console.log(req.body);
  const fl_marks = await Mark.aggregate()
    .lookup({
      from: "students",
      localField: "student_id",
      foreignField: "_id",
      as: "student_id",
    })
    .unwind("$student_id")
    .match({
      $and: [
        { "student_id.department": new mongoose.Types.ObjectId(department_id) },
        { semester_id: new mongoose.Types.ObjectId(semester_id) },
        { "student_id.batch_of_year": batch_of_year },
      ],
    })
    .sort({ percentage: position });
  res.json(Response.success(fl_marks));
};
module.exports = {
  create_marks,
  give_marks,
  get_marks,
  filter_marks,
};
