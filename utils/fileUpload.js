const multer = require('multer');
const path = require('path');

// Set storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadPath = path.join(__dirname, '..', 'public', 'uploads');
        cb(null, uploadPath);
    },
    filename: function(req, file, cb) {
        cb(
            null,
            path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname)
        );
    }
});

// upload
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter(req, file, cb) {
        checkFileTypes(file, cb);
    }
});

function checkFileTypes(file, cb) {
    const filetypes = /jpeg|jpg|png|svg|webp|JFIF/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error('Only image (jpeg, jpg, png, svg, webp) are allowed'));
    }
}

module.exports = upload;
