const multer = require('multer')
const {Response} = require('../helpers/helper')

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.FOLDER)
    },
    filename: (req, file, cb) => {
        cb(null,Date.now()+"-"+ file.originalname)
    }
});
const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
module.exports.upload=multer({
    storage,
    fileFilter,
    limits : {
      fileSize :1024 * 1024
  },
}).any()

// module.exports.file_upload=(req,res,next)=>{
//   console.log("dcdcscdscscss")
//   upload(req, res,(err)=> {
//     if (err instanceof multer.MulterError) {
//       console.log("ERROR")
//       res.status(400).json(Response.error(err.message))
//     } else{
//       console.log("UPLOaded")
//       console.log(req.files)
//       next()
//     }
//   })
// }



