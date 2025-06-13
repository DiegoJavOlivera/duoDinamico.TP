const bcrypt = require("bcrypt");

const validateUserData = (userData) => {
    const { name, email, password, role_id } = userData;
    
    if (!name || !email || !password || !role_id) {
        return {
            isValid: false,
            error: "Todos los campos son requeridos"
        };
    }

    return { isValid: true };
};

const checkEmailExists = async (User, email) => {
    const existingUser = await User.findOne({ where: { email } });
    return !!existingUser;
};

const returnUser = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role_id: user.role_id
});

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

module.exports = {
    validateUserData,
    checkEmailExists,
    returnUser,
    hashPassword
}; 