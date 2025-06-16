const {User} = require('../models');


const findByPkCustom = async (id) => {
    try {
        const user = await User.findByPk(id);
        return user;
    } catch (error) {
        throw new Error("Error finding user by ID: " + error.message);
    }
}

module.exports = {
    findByPkCustom,
}