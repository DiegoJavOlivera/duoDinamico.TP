const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwt.config');

/**
 * Genera un token JWT para el usuario autenticado.
 * @param {Object} user - Objeto usuario con al menos id y email.
 * @param {number|string} user.id - ID del usuario.
 * @param {string} user.email - Email del usuario.
 * @returns {string} Token JWT firmado.
 */
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user.id,
            email: user.email,
        },
        secret,
        { expiresIn: expiresIn }
    );
};

/**
 * Verifica y decodifica un token JWT.
 * @param {string} token - Token JWT a verificar.
 * @returns {Object} Payload decodificado si el token es válido.
 * @throws {Error} Si el token es inválido o expiró.
 */
const verifyToken = (token) => {
    return jwt.verify(token, secret);
};

module.exports = {
    generateToken,
    verifyToken
}; 