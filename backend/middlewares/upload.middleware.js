const multer = require('multer');
const path = require('path');
const {getConfig} = require('../config/index');



const IMAGES_PATH = getConfig("IMAGE_PATH"); 

/**
 * Configuración de almacenamiento para multer.
 * Define la carpeta de destino y el formato de nombre de los archivos subidos.
 * @type {import('multer').StorageEngine}
 */
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


/**
 * Filtro de archivos para multer. Permite solo imágenes JPEG, PNG y GIF.
 *
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {Express.Multer.File} file - Archivo recibido.
 * @param {Function} cb - Callback de multer para aceptar o rechazar el archivo.
 */
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes JPEG, PNG y GIF.'), false);
    }
}


/**
 * Middleware de multer para subir un solo archivo de imagen.
 *
 * - Almacena el archivo en la ruta configurada y con nombre único.
 * - Solo permite imágenes JPEG, PNG o GIF de hasta 5MB.
 * - El campo esperado es 'image'.
 *
 * @type {import('express').RequestHandler}
 */
const upload = multer({storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }).single('image');



// Middleware para upload opcional (no falla si no hay archivo)
/**
 * Middleware para subida de archivo opcional.
 *
 * - Llama a 'upload', pero no falla si no hay archivo presente.
 * - Solo responde con error si multer arroja un error real (tipo de archivo inválido, tamaño, etc).
 * - Si no hay archivo, continúa normalmente.
 *
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 */
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
