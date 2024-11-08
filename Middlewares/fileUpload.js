// Middlewares/fileUpload.js
const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/', // Directory to save uploaded files
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 1MB file size limit
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single('document'); // 'document' is the name of the form field

// Check file type
function checkFileType(file, cb) {
  const filetypes = /pdf|docx|xlsx/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

  return cb(null, true);
}

module.exports = upload;