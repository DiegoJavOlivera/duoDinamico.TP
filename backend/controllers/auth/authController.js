
const { findUserByEmail } = require("../../repository/authRepository");
const { isValidPassword } = require("../../utils/userUtils");
const { generateToken } = require("../../utils/jwtUtils");

/**
 * Inicia sesión de usuario.
 *
 * - Verifica email y contraseña.
 * - Devuelve token JWT si es correcto.
 *
 * @param {import('express').Request} req - Request HTTP (requiere body con email y password)
 * @param {import('express').Response} res - Response HTTP
 * @returns {Promise<void>} Responde con 200 y token, 400/404/500 si hay error
 */
const signIn = async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });  
  }
};

module.exports = {
  signIn,
};