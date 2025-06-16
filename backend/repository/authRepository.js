const {User} = require("../models");


const findUserByEmail = (email) => User.findOne({ where:{ email}});


module.exports = {
    findUserByEmail,
}