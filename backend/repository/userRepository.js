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

const checkEmailExists = async (email) => {
    const existingUser = await User.findOne({ where: { email } });
    return !!existingUser;
};

const getAllUsers = async () =>{
    try {
        const users = await User.findAll();
        return users;
    } catch (error) {
        throw new Error("Error al obtener los usuarios: " + error.message);
    }
}


module.exports = {
    createNewUser,
    checkEmailExists,
    getAllUsers
};