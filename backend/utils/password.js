const bcrypt = require("bcrypt");

function isValidPassword (currentPassword, expectedPassword) {    
    return bcrypt.compare(currentPassword, expectedPassword);
}
 
module.exports = {
    isValidPassword
};