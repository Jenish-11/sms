const mongoose = require("mongoose");

const { Schema } = require("mongoose");
const { Semester } = require("./semester");
const { Students } = require("./students");

const mark = new Schema(
  {
    student_id: {
      type: Schema.Types.ObjectId,
      ref: "student",
    },
    semester_id: {
      type: Schema.Types.ObjectId,
      ref: "semesters",
    },
    result: [
      {
        subject_id: {
          type: Schema.Types.ObjectId,
          ref: "subjects",
        },
        grade: {
          type: Number,
          default: 0,
        },
      },
    ],
    totalMarks: {
      type: Number,
    },
    percentage: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

mark.pre("save", async function (next) {
  try {
    console.log("THIS", this.student_id);
    const st = await Students.findOne({
      _id: new mongoose.Types.ObjectId(this.student_id),
    }).exec();
    const sem = await Semester.findById(this.semester_id);
    console.log("ST", st.department);
    console.log("SEM", sem.department);
    if (this.isModified("result")) {
      let totalMarks = 0;
      this.result.forEach((subject) => {
        totalMarks += subject.grade;
      });
      this.percentage = totalMarks + 100;
      console.log("PER", this.percentage);
    }

    if (st?.department?.toString() != sem?.department.toString()) {
      const error = new Error("department id not matching");
      return next(error);
    }
    if (this.result.length == 0) {
      for (const sub of sem.subjects) {
        this.result.push({ subject_id: sub });
      }
      return next();
    }
    console.log("NEXT");
    return next();
  } catch (e) {
    next(e);
  }
});
// mark.pre("updateOne", async function (next) {
//   try {
//     const filter = this.getFilter();
//     console.log("FILTER", filter);
//     const update = this.getUpdate();
//     console.log("UPDATE", update);
//     const options = this.getOptions();
//     console.log("OPTIONS", this.getOptions());
//     const query = this.getQuery();
//     console.log("GETQUERY", this.getQuery());
//     console.log("GET", this.gte());

//     const option = { new: true };
//     // const docBeforeUpdate = await this.model.findOne(filter);
//     // await this.updateOne(update, options).exec();
//     // const docAfterUpdate = await this.model.findOne(filter);
//     const updated = await this.updateOne(filter, update, options).exec();
//     const updatedDoc = await this.model.findOne(filter);
//     console.log("UPDATEDDOC", updatedDoc);
//     const updatedResult = updatedDoc.result;
//     console.log("UPDATE", updatedResult);
//     if (updatedResult) {
//       // Check if the result array has been updated
//       let totalMarks = 0;
//       updatedResult.forEach((subject) => {
//         totalMarks += subject.grade;
//       });
//       this.updateOne({}, { $set: { totalMarks: totalMarks } }).exec();
//       this.updateOne(
//         {},
//         {
//           $set: {
//             percentage: (totalMarks / (updatedResult.length * 100)) * 100,
//           },
//         }
//       ).exec();
//     }
//     next();
//   } catch (e) {
//     console.log(e.message);
//   }
// });
const Mark = mongoose.model("marks", mark);
module.exports = { Mark };
