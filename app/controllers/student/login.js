const { send_email } = require("../../../config/send_email");
const { Response } = require("../../../helpers/helper");
const { Students } = require("../../models/students");
const { St_login } = require("../../models/student_login");
const jwt = require("jsonwebtoken");
const student_login = async (req, res) => {
  try {
    const st = await Students.findOne({ email: req.body.email });
    console.log("ST", st);
    if (!st) {
      throw new Error("Email ID Not Exits");
    }
    const confirmationCode = Math.floor(Math.random() * 999999 + 100000);
    const login = await St_login.create({
      student_id: st._id,
      user_agent: req.headers["user-agent"],
      ip: req.socket.remoteAddress,
      status: false,
      token: confirmationCode,
    });
    console.log("LOGIN", login);
    // const token = jwt.sign({st,}, process.env.JWT_SECRET);
    const subject = "Login";
    const text = "hi Hello bye";
    const html = `<h1>Email Confirmation</h1>
     <h2>Hello ${st.name}</h2>
     <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
     <h1>your confirmation code is </h1>
     <h2>${confirmationCode}<h2/>
     </div>`;
    if (login) {
      send_email(req.body.email, subject, text, html);
      res.json(Response.success("Otp send to the client"));
    } else {
      throw new Error("Internal Error");
    }
  } catch (e) {
    res.status(400).json(Response.error(e.message));
  }
};
const verify_otp = async (req, res) => {
  try {
    const st = await St_login.findOne({ token: req.body.otp });
    if (!st) {
      throw new Error("OTP is not correct");
    } else {
      const student = await Students.findOne({ _id: st.student_id });
      if (!student) {
        throw new Error("Student Not Exit");
      }
      const token = jwt.sign({ student }, process.env.JWT_SECRET);
      const st_log = await St_login.findOneAndUpdate(
        { _id: st._id },
        {
          $set: { token: token, status: true },
        }
      );
      console.log("STLOG", st_log);
      if (!st_log) {
        throw new Error("Login Not SuccessFull");
      }
      res
        .cookie("sms", token, { maxAge: 900000, httpOnly: true })
        .json(Response.success(token));
    }
  } catch (e) {
    return res.status(400).json(Response.error(e.message));
  }

  console.log(req.headers["user-agent"]);
  console.log(req.socket.remoteAddress);
};
const logout = (req, res, next) => {};
module.exports = {
  student_login,
  verify_otp,
};
