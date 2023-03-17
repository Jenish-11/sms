const jwt = require("jsonwebtoken");
const { St_login } = require("../app/models/student_login");
module.exports.authentication = async (req, res, next) => {
  console.log(req.headers["user-agent"]);
  console.log(req.socket.remoteAddress);
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    const st = await St_login.findOne({
      token: token,
      ip: req.socket.remoteAddress,
      user_agent: req.headers["user-agent"],
    });
    return res.status(401).json({ message: "token is missing" });
  }
  const st = await St_login.findOne({
    token: token,
    ip: req.socket.remoteAddress,
    user_agent: req.headers["user-agent"],
  });
  try {
    const decoded = jwt.verify(token, "secret");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
