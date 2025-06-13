const { User } = require("../../models");
const { 
    validateUserData, 
    checkEmailExists, 
    returnUser, 
    hashPassword 
} = require("../../utils/userUtils");


const createUser = async (req, res) => {
    try {
        const userData = req.body;
        
        const validation = validateUserData(userData);
        if (!validation.isValid) {
            return res.status(400).json({ error: validation.error });
        }

        const emailExists = await checkEmailExists(User, userData.email);
        if (emailExists) {
            return res.status(400).json({ error: "El email ya está registrado" });
        }

        const hashedPassword = await hashPassword(userData.password);
        const newAdmin = await User.create({
            ...userData,
            password: hashedPassword,
            is_active: true
        });

        res.status(201).json({
            message: "Administrador creado exitosamente",
            user: returnUser(newAdmin)
        });
    } catch (error) {
        console.error("Error al crear administrador:", error);
        res.status(500).json({ error: "Error al crear el administrador" });
    }
};

module.exports = {
    createUser
};
