const { User } = require("../../models");
const { isValidPassword } = require("../../utils/password");
const { generateToken } = require("../../utils/jwtUtils");

const signIn = async (req, res) => {
  // implement
};

module.exports = {
    signIn,
};