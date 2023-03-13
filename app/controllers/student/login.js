const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB file size limit
  },
  fileFilter: fileFilter
});

app.post('/upload', upload.single('image'), (req, res, next) => {
  // Handle any errors that may have occurred during file upload
  if (req.fileValidationError) {
    return res.status(400).send({ error: req.fileValidationError });
  } else if (req.file) {
    console.log('File uploaded successfully.');
    return res.status(200).send({ message: 'File uploaded successfully.' });
  }
  res.status(400).send({ error: 'File upload failed.' });
});
