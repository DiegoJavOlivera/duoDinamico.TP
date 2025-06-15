const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwt.config');

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

const verifyToken = (token) => {
    return jwt.verify(token, secret);
};

module.exports = {
    generateToken,
    verifyToken
}; 