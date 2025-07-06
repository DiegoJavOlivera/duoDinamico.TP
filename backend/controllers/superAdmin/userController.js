const { 
    validateUserData, 
    returnUser, 
    hashPassword 
} = require("../../utils/userUtils");
const { addLog } = require("../../repository/logRepository");

const {create,
    checkEmailExists,
    getAllUsers
} = require("../../repository/userRepository");

const ACTION_ID_CREATE_USER = 3;

const createUser = async (req, res) => {
    try {
        console.log("Creating user with data:", req.body);
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

        const logData = {
            user_id: req.user.dataValues.id,
            action_id: ACTION_ID_CREATE_USER
        };
        await addLog(logData);

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
