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

/**
 * @fileoverview Controlador de usuarios para el módulo SuperAdmin.
 * Permite crear nuevos administradores y listar todos los usuarios.
 */

const ACTION_ID_CREATE_USER = 3;

/**
 * Crea un nuevo usuario administrador.
 *
 * - Valida los datos recibidos en el body.
 * - Verifica que el email no esté registrado.
 * - Hashea la contraseña y crea el usuario activo.
 * - Registra la acción en el log.
 * - Devuelve el usuario creado (sin contraseña).
 *
 * @param {import('express').Request} req - Request HTTP (requiere body con datos de usuario)
 * @param {import('express').Response} res - Response HTTP
 * @returns {Promise<void>} Responde con 201 y usuario creado, o error 400/500
 */
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

/**
 * Obtiene todos los usuarios del sistema.
 *
 * @param {import('express').Request} req - Request HTTP
 * @param {import('express').Response} res - Response HTTP
 * @returns {Promise<void>} Responde con 200 y array de usuarios
 */
const getUsers = async (req, res) => {
    const users = await getAllUsers();
    res.status(200).json(users);
};

module.exports = {
    createUser,
    getUsers
};
