const { verifyToken } = require('../utils/jwtUtils');
const { findByPkCustom } = require('../repository/userRepository');


/**
 * Middleware que verifica si el usuario está autenticado mediante JWT.
 *
 * - Busca el token en el header Authorization (Bearer <token>).
 * - Valida el token y busca el usuario en la base de datos.
 * - Si el usuario existe y está activo, lo agrega a req.user y permite el acceso.
 * - Si no, responde con 401.
 *
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {void}
 */
const isAuthenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token proporcionado' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = await verifyToken(token);
        const user = await findByPkCustom(decoded.id);

        if (!user || !user.is_active) {
            return res.status(401).json({ error: 'Usuario no encontrado o inactivo' });
        }  

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
};

/**
 * Middleware que verifica si el usuario autenticado es SuperAdmin.
 *
 * - Permite el acceso solo si req.user.role_id === 2.
 * - Si no, responde con 403 (acceso denegado).
 *
 * @param {import('express').Request} req - Objeto de solicitud HTTP (requiere req.user).
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {void}
 */
const isSuperAdmin = async (req, res, next) => {
    try {
        if (req.user.role_id !== 2) {
            return res.status(403).json({ error: 'Acceso denegado. Se requieren privilegios de superadmin' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ error: 'Error al verificar permisos' });
    }
}; 


/**
 * Middleware que verifica si el usuario autenticado es Admin o SuperAdmin.
 *
 * - Permite el acceso solo si req.user.role_id es 1 (Admin) o 2 (SuperAdmin).
 * - Si no, responde con 403 (acceso denegado).
 *
 * @param {import('express').Request} req - Objeto de solicitud HTTP (requiere req.user).
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {void}
 */
const isAdmin = async (req, res, next) => {
    try {
        if (![1, 2].includes(req.user.role_id)) { 
            return res.status(403).json({ error: 'Acceso denegado. Se requieren privilegios de admin' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ error: 'Error al verificar permisos' });
    }
};

module.exports = {
    isAuthenticate,
    isSuperAdmin,
    isAdmin
}; 