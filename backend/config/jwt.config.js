
module.exports = {
    secret: process.env.JWT_SECRET,
    expiresIn: '24h', 
    refreshExpiresIn: '7d'
}; 