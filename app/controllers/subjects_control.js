const mongoose = require("mongoose");
const joi = require("joi");
const path = require("path");
const { Response } = require("../../helpers/helper");
const { Subject } = require("../models/subjects");

const create_subject = async (req, res) => {
  const body = req.body;
  console.log(body);
  try {
    const s = await Subject.create(body);
    return res.json(Response.success(s));
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json(Response.error(e.code == 11000 ? "sub already exits" : e.message));
  }
};
const get_subject = async (req, res) => {
  try {
    const sub_name = req.query.name;
    id = new mongoose.Types.ObjectId(req.query.id);
    var result;
    const sub = Subject.aggregate().project({ name: 1 });
    if (JSON.stringify(req.query) != "{}") {
      sub.match({ $or: [{ name: { $regex: sub_name } }, { _id: id }] });
      result = await sub;
      if (result.length == 0) {
        return res.json(Response.error("Not Found "));
      }
      return res.json(Response.success(result));
    }
    result = await sub;
    return res.json(Response.success(result));
  } catch (e) {
    return res.status(400).json(Response.error(e.message));
  }
};
module.exports = {
  create_subject,
  get_subject,
};
