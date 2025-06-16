
const {User} = require("../models");


const create = (userData) => User.create(userData);

const checkEmailExists = (email) => User.findOne({ where: { email } });

const getAllUsers = () => User.findAll();

const findByPkCustom = (id) => User.findByPk(id);

module.exports = {
    create,
    checkEmailExists,
    getAllUsers,
    findByPkCustom
};  