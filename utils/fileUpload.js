const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Upload papkasini yaratish
const uploadPath = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true }); // Agar papka yo'q bo'lsa, uni yaratish
}

// Fayl saqlash konfiguratsiyasi
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadPath); // Faylni "public/uploads" papkasiga saqlash
    },
    filename: function(req, file, cb) {
        const fileName = `dish-${Date.now()}-${path.basename(file.originalname, path.extname(file.originalname))}${path.extname(file.originalname)}`;
        cb(null, fileName); // Fayl nomini belgilash
    }
});

// Fayl yuklash konfiguratsiyasi
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Maksimal fayl hajmi 10MB
    fileFilter(req, file, cb) {
        checkFileTypes(file, cb); // Fayl turlarini tekshirish
    }
}).single('img'); // 'img' nomli faylni qabul qiladi

// Fayl turlarini tekshirish
function checkFileTypes(file, cb) {
    const filetypes = /jpeg|jpg|png|svg|webp|JFIF/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        cb(null, true); // Fayl turi to'g'ri bo'lsa, uni qabul qilamiz
    } else {
        cb(new Error('Only image (jpeg, jpg, png, svg, webp) are allowed')); // Xato xabarini yuborish
    }
}

module.exports = upload;
