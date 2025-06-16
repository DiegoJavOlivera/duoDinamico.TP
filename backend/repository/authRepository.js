const {User} = require("../models");


const findUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ where:{ email}});
        return user;
    } catch (error) {
        throw new Error("Error finding user by email: " + error.message);
    }
}



module.exports = {
    findUserByEmail,
}