const multer = require('multer');
const path = require('path');

require('dotenv').config();

const IMAGES_PATH = process.env.IMAGES_PATH 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, IMAGES_PATH);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
})

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes JPEG, PNG y GIF.'), false);
    }
}

const upload = multer({storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }).single('image');

module.exports = {
    upload,
}
