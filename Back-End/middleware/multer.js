const multer = require("multer");
const path = require("path"); // Tambahkan baris ini

// Konfigurasi storage untuk multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Inisialisasi multer dengan konfigurasi storage
const upload = multer({ storage: storage });

module.exports = {
  upload: upload, // Export the upload middleware
};
