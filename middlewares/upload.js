const multer = require("multer");
const { Response } = require("../helpers/helper");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.FOLDER);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("FILE TYPE NOT MATCH"), false);
  }
};
module.exports.upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024,
  },
});

module.exports.file_upload = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res
      .status(400)
      .json(Response.error("File upload error: " + err.message));
  } else if (err) {
    return res.status(500).json(Response.error(err.message));
  }
  next();
};
