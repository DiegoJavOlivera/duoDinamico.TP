const { 
    validateUserData, 
    returnUser, 
    hashPassword 
} = require("../../utils/userUtils");

const {create,
    checkEmailExists,
    getAllUsers
} = require("../../repository/userRepository");


const createUser = async (req, res) => {
    try {
        const userData = req.body;
        const validation = validateUserData(userData);
        if (!validation.isValid) {
            return res.status(400).json({ error: validation.error });
        }

        const emailExists = await checkEmailExists(userData.email);
        if (!!emailExists) {
            return res.status(400).json({ error: "El email ya está registrado" });
        }

        const hashedPassword = await hashPassword(userData.password);

        const newAdmin = await create({
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

const getUsers = async (req, res) => {
    const users = await getAllUsers();
    res.status(200).json(users);
};

module.exports = {
    createUser,
    getUsers
};
