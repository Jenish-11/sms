const { Students } = require("../models/students");
const mongoose = require("mongoose");
const joi = require("joi");
const path = require("path");
const jwt = require("jsonwebtoken");
const { send_email } = require("../../config/send_email");
const { St_login } = require("../models/student_login");
const index = `${process.env.SERVER}/upload/index.html`;
const { Response } = require("../../helpers/helper");
const { log } = require("console");
console.log("dd");
module.exports.add = async (req, res) => {
  const student = req.body;
  const dpt = req.body.dpt;
  try {
    const emailExists = await Students.findOne({ email: student.email }).exec();
    const stmd = await Students.find({
      department: new mongoose.Types.ObjectId(student.department),
    })
      .sort({ createdAt: -1 })
      .exec();
    let result = stmd[0]?.roll_number.replace(/[^0-9]/g, "");
    if (emailExists) {
      return res.json(Response.error("email already exist"));
    }
    console.log("2nd");
    var mrs = () => (student.gender == "M" ? "MR " : "Ms ");
    const s = await Students.create({
      ...student,
      name: mrs() + student.name,
      photo: req.files[0].filename,
      roll_number: !result
        ? dpt.dpt_code + (1).toString().padStart(4, "0")
        : dpt.dpt_code + (parseInt(result) + 1).toString().padStart(4, "0"),
    });
    return res.json(Response.success(s));
    // .then((s)=>res.json(Response.success(s))).catch((e)=>res.status(400).json(Response.error(e.message)))
  } catch (e) {
    res.status(400).json(Response.error(e.message));
  }
};
module.exports.get_students = async (req, res) => {
  try {
    const items = req.query.item ? req.query.item : "!";
    const id = req.query.id;

    console.log("QUERY", req.query);
    var stu;
    var fl_st = Students.aggregate()
      .lookup({
        from: "departments",
        localField: "department",
        foreignField: "_id",
        as: "department_details",
      })
      .unwind("$department_details")
      .addFields({
        photo: {
          $concat: [process.env.SERVER, "/", process.env.FOLDER, "/", "$photo"],
        },
      });
    req.query.item || id
      ? (stu = await fl_st
          .match({
            $or: [
              { email: { $regex: items } },
              { _id: new mongoose.Types.ObjectId(id) },
              { roll_number: { $regex: items, $options: "si" } },
              { "department_details.name": { $regex: items } },
            ],
          })
          .exec())
      : (stu = await fl_st.exec());
    return res.json(Response.success(stu));
  } catch (e) {
    return res.status(400).json(Response.error(e.message));
  }
};
module.exports.get_student_by_id = async (req, res) => {
  try {
    const student = await Students.aggregate()
      .match({ _id: new mongoose.Types.ObjectId(req.body.id) })
      .addFields({
        photo: {
          $concat: [process.env.SERVER, "/", process.env.FOLDER, "/", "$photo"],
        },
      })
      .exec();

    res.json(Response.success(student));
  } catch (e) {
    res.status(400).json(Response.error(e.message));
  }
};
module.exports.update_students = async (req, res) => {
  try {
    const update = req.body;
    const id = update.student_id;
    delete update.id;
    var mrs = (g) => (g == "M" ? "MR " : "Ms ");
    const stu = await Students.findById(id);
    let flatten = (obj, prefix, result) => {
      result = result || {};
      for (let key of Object.keys(obj)) {
        let keyExpr = prefix ? `${prefix}.${key}` : `${key}`;
        if (typeof obj[key] === "object") {
          flatten(obj[key], keyExpr, result);
        } else {
          result[keyExpr] = obj[key];
        }
      }
      return result;
    };
    if (req.files[0]) {
      console.log("FILES", req.files);
      update.photo = req.files[0].filename;
    }
    if (update.name) {
      update.name =
        mrs(update.gender ? update.gender : stu.gender) + update.name;
    } else if (update.gender) {
      update.name = mrs(update.gender) + stu.name.split(" ")[1];
    }
    let update1 = flatten(update);

    const st = Students.findByIdAndUpdate(id, { $set: update1 })
      .then(async () =>
        Students.findById(id)
          .then((doc) => res.json(Response.success(doc)))
          .catch((err) => res.status(200).json(Response.error(err.message)))
      )
      .catch((err) => res.status(400).json(Response.error(err.message)));
  } catch (e) {
    return res.status(400).json(Response.error(e.message));
  }
};
module.exports.delete_students = async (req, res) => {
  const student_id = req.body.student_id;
  try {
    const st = await Students.deleteOne({
      _id: new mongoose.Types.ObjectId(student_id),
    }).exec();
    res.json(Response.success(st));
  } catch (e) {
    res.status(400).json(Response.error(e.message));
  }
};
module.exports.get_students_with_dpt = async (req, res) => {
  try {
    const vali = joi.object({
      _id: joi.string(),
    });
    const student_dpt = await Students.aggregate()
      .project({ department: 1 })
      .match({ _id: new mongoose.Types.ObjectId(req.body._id) })
      .lookup({
        from: "departments",
        localField: "department",
        foreignField: "_id",
        as: "department_details",
      });
    // .then((s)=>res.json(s)).catch(err=>res.status(500).json(err))
    res.json(student_dpt);
  } catch (e) {
    console.log(e);
    // student_dpt.then(e).catch((err)=>res.json(err))
    res.status(400).json("user Not Found");
  }
};

module.exports.student_image = async (req, res) => {
  console.log(req.body);
  const file = req.files[0];
  console.log(file);
  res.json({
    image: `${process.env.SERVER}/${process.env.FOLDER}/${file.filename}`,
  });
  // res.redirect(`${process.env.SERVER}/upload/${file.filename}`)
};
module.exports.get_image = (req, res) => {
  // console.log(req.body)
  res.json({
    image: `${process.env.SERVER}/upload/${"1677756623832-DSC_0301.JPG"}`,
  });
  // res.redirect(`${process.env.SERVER}/upload/${'1677756623832-DSC_0301.JPG'}`)
};

module.exports.student_login = async (req, res) => {
  // confirmationCode = Math.floor((Math.random() * 999999) + 100000);
  const st = await Students.find({ email: req.body.email });
  const login = St_login.create({
    email: req.body.email,
    user_agent: req.headers["user-agent"],
    ip: req.socket.remoteAddress,
    status: false,
  });
  // const token = jwt.sign({st,}, process.env.JWT_SECRET);
  const subject = "Login";
  const text = "hi Hello bye";
  const html = `<h1>Email Confirmation</h1>
   <h2>Hello ${st.name}</h2>
   <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
   <h1>your confirmation code is </h1>
   <button><a href=${process.env.SERVER}/verify-otp/${req.body.email}/${token}> Click here</a></button>
   </div>`;
  if (login.status == false) {
    send_email(req.body.email, subject, text, html);
    res.json("success");
  }
  // res.json("success")
};
module.exports.verify_otp = async (req, res) => {
  const student = await Students.find({ email: req.params.email });
  St_login.updateOne({
    email: req.params.email,
    user_agent: req.headers["user-agent"],
    ip: req.socket.remoteAddress,
  });
  console.log(req.headers["user-agent"]);
  console.log(req.socket.remoteAddress);

  //    if(confirmationCode==req.params.code){
  //     const token = jwt.sign({student,}, process.env.JWT_SECRET);
  //     // res.cookie('sms',token, { maxAge: 900000, httpOnly: true }).json("success");
  //    }
  //    else{
  //     res.status(401).json("error")
  //    }

  // return res.json({token})
};
// module.exports={
//     get_student_by_id,
// }
