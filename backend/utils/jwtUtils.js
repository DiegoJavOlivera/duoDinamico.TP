const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.config');

const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user.id,
            email: user.email,
            role_id: user.role_id
        },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { 
            id: user.id,
            type: 'refresh'
        },
        jwtConfig.secret,
        { expiresIn: jwtConfig.refreshExpiresIn }
    );
};


const verifyToken = (token) => {
    try {
        return jwt.verify(token, jwtConfig.secret);
    } catch (error) {
        throw new Error('Token inválido');
    }
};

module.exports = {
    generateToken,
    generateRefreshToken,
    verifyToken
}; 