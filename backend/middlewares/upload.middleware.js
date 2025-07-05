const multer = require('multer');
const path = require('path');
const {getConfig} = require('../config/index');



const IMAGES_PATH = getConfig("IMAGE_PATH"); 

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

// Middleware para upload opcional (no falla si no hay archivo)
const uploadOptional = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            // Solo fallar si es un error real de multer, no si simplemente no hay archivo
            if (err instanceof multer.MulterError || err.message.includes('Tipo de archivo no permitido')) {
                return res.status(400).json({ message: err.message });
            }
        }
        // Continuar incluso si no hay archivo
        next();
    });
};

module.exports = {
    upload,
    uploadOptional
}
