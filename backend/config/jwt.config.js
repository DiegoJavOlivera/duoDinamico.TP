/**
 * Exporta configuración del JWT (secreto y expiración).
 */
const { getConfig } = require('./index');

module.exports = {
    secret: getConfig('JWT_SECRET'),
    expiresIn: '24h'
};