const { Mark } = require("../app/models/marks");
const { Response } = require("../helpers/helper");

module.exports.mark_id_exist = async (req, res, next) => {
  const id = req.query.id ? req.query.id : req.body.mark_id;
  let mar;
  try {
    if (id) {
      mar = await Mark.findOne({ _id: id }).exec();
      console.log("MAR", mar);
      if (mar) {
        req.body.mar = mar;
        return next();
      } else {
        return res.status(400).json(Response.error("mark id not exit"));
      }
    }
    next();
  } catch (e) {
    return res.status(400).json(Response.error(e.message));
  }
};
