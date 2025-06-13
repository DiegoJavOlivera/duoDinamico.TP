const bcrypt = require("bcrypt");
const salt = process.env.JWT_SECRET;

function _encrypt(password) {
    return bcrypt.hash(password, 10);
    // return new Promise((resolve, reject) => {
    //     bcrypt.genSalt(10, (err, salt) => {
    //         if (err) reject(err);

    //         bcrypt.hash(password, salt, (err, hash) => {
    //             if (err) reject(err);
    //             resolve(hash);
    //         });
    //     });
    // })
}

async function _compare(currentPassword, encryptedPassword) {
    const processedPassword = await _encrypt(currentPassword);
    return encryptedPassword === processedPassword;
}
  
function isValidPassword (currentPassword, expectedPassword) {
    return  _compare(currentPassword, expectedPassword);
}
 
module.exports = {
    isValidPassword
};