
const { findUserByEmail } = require("../../repository/authRepository");
const { isValidPassword } = require("../../utils/password");
const { generateToken } = require("../../utils/jwtUtils");

const signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const isValidUser = await isValidPassword(password, user.dataValues.password);

  if (!isValidUser) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const token =  generateToken(user);
  
  res.status(200).json({ 
    message: "Login successful",
    token,
    user: {
      id: user.id,
      email: user.email
    }
  });
};

module.exports = {
  signIn,
};