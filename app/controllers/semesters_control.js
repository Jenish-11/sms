const { Students } = require("../models/students");
const mongoose = require("mongoose");
const joi = require("joi");
const path = require("path");
const index = `${process.env.SERVER}/upload/index.html`;
const { Response } = require("../../helpers/helper");
const { Semester } = require("../models/semester");

const create_semester = async (req, res) => {
  const body = req.body;
  console.log(body);
  try {
    const s = await Semester.create(body);
    return res.json(Response.success(s));
  } catch (e) {
    res.status(400).json(Response.error(e.message));
  }
};
const get_semester = async (req, res) => {
  try {
    const items = req.query.item ? req.query.item : "!";
    const id = req.query.id;
    console.log("QUERY", req.query);
    var stu;
    var fl_st = Semester.aggregate()
      .lookup({
        from: "departments",
        localField: "department",
        foreignField: "_id",
        as: "department_details",
      })
      .unwind("$department_details");
    req.query.item || id
      ? (stu = await fl_st.match({
          $or: [
            { sem: parseInt(items) },
            { _id: new mongoose.Types.ObjectId(id) },
            { "department_details.name": { $regex: items, $options: "si" } },
          ],
        }))
      : (stu = await fl_st.exec());
    return res.json(Response.success(stu));
  } catch (e) {
    return res.status(400).json(Response.error(e.message));
  }
};
// const update_semester = async (req, res) => {
//   try {
//     const update = req.body;
//     const id = update.id;
//     delete update.id;
//     var mrs = (g) => (g == "M" ? "MR " : "Ms ");
//     const stu = await Students.findById(id);
//     let flatten = (obj, prefix, result) => {
//       result = result || {};
//       for (let key of Object.keys(obj)) {
//         let keyExpr = prefix ? `${prefix}.${key}` : `${key}`;
//         if (typeof obj[key] === "object") {
//           flatten(obj[key], keyExpr, result);
//         } else {
//           result[keyExpr] = obj[key];
//         }
//       }
//       return result;
//     };
//     if (req.files[0]) {
//       console.log("FILES", req.files);
//       update.photo = req.files[0].filename;
//     }
//     if (update.name) {
//       update.name =
//         mrs(update.gender ? update.gender : stu.gender) + update.name;
//     } else if (update.gender) {
//       update.name = mrs(update.gender) + stu.name.split(" ")[1];
//     }
//     let update1 = flatten(update);

//     const st = Students.findByIdAndUpdate(id, { $set: update1 })
//       .then(async () =>
//         Students.findById(id)
//           .then((doc) => res.json(Response.success(doc)))
//           .catch((err) => res.status(200).json(Response.error(err.message)))
//       )
//       .catch((err) => res.status(400).json(Response.error(err.message)));
//   } catch (e) {
//     res.status(400).json(Response.error(e.message));
//   }
// };
// const delete_semester = async (req, res) => {
//   try {
//     const st = await Students.deleteOne({
//       _id: new mongoose.Types.ObjectId(req.body.id),
//     }).exec();
//     res.json(Response.success(st));
//   } catch (e) {
//     res.status(400).json(Response.error(e.message));
//   }
// };
module.exports = {
  create_semester,
  get_semester,
};
