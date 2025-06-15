const {returnUser} = require("../utils/userUtils");

const {User} = require("../models");


const createNewUser = async (userData) => {
    try {
        const newAdmin = await User.create(userData)
        return returnUser(newAdmin);
    } catch (error) {
        throw new Error("Error al crear el usuario: " + error.message);
    }
}

module.exports = {
    createNewUser,
};