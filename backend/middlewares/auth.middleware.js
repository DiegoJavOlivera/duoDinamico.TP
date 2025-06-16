const { verifyToken } = require('../utils/jwtUtils');
const { findByPkCustom } = require('../repository/userRepository');


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