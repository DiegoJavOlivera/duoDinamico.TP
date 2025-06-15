const { getConfig } = require('./index');

module.exports = {
    secret: getConfig('JWT_SECRET'),
    expiresIn: '24h'
}; 