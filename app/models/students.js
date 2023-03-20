const mongoose = require("mongoose");

const { Schema } = require("mongoose");
const { Dpt } = require("./department");

const student_schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "email is must"],
      unique: [true, "email must be unique"],
    },
    phone_number: {
      type: Number,
      required: [true, "Ph_number is required"],
    },
    address: {
      line1: {
        type: String,
        required: true,
      },
      line2: {
        type: String,
        required: true,
      },
      district: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pin: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    father_name: {
      type: String,
      required: true,
    },
    mother_name: {
      type: String,
      required: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "departments",
    },
    photo: {
      type: String,
    },
    semester: {
      type: String,
      // required:true
    },
    roll_number: {
      type: String,

      // required:true
    },
    gender: {
      type: String,
      required: true,
      enum: ["M", "F"],
    },
    batch_of_year: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// student_schema.pre('save',async(next)=>{
//     const doc = this;
//     const dpt_code = await Dpt.findById(doc.department).exec()
//     const st_dpt = await Students
//     doc.roll_number=dpt_code.dpt_code+
// })
module.exports.Students = mongoose.model("student", student_schema);
