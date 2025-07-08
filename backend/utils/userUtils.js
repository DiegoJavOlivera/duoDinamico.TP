const bcrypt = require("bcrypt");

/**
 * Valida los datos de usuario requeridos para el registro o actualización.
 * @param {Object} userData - Objeto con los datos del usuario.
 * @param {string} userData.name - Nombre del usuario.
 * @param {string} userData.email - Email del usuario.
 * @param {string} userData.password - Contraseña del usuario.
 * @param {number|string} userData.role_id - ID del rol del usuario.
 * @returns {Object} Resultado de la validación.
 * @returns {boolean} return.isValid - Indica si los datos son válidos.
 * @returns {string} [return.error] - Mensaje de error si los datos no son válidos.
 */
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

/**
 * Devuelve un objeto usuario con los campos públicos principales.
 * @param {Object} user - Objeto usuario de la base de datos.
 * @param {number|string} user.id - ID del usuario.
 * @param {string} user.name - Nombre del usuario.
 * @param {string} user.email - Email del usuario.
 * @param {number|string} user.role_id - ID del rol del usuario.
 * @returns {Object} Objeto usuario simplificado.
 */
const returnUser = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role_id: user.role_id
});

/**
 * Hashea una contraseña usando bcrypt.
 * @param {string} password - Contraseña en texto plano.
 * @returns {Promise<string>} Contraseña hasheada.
 */
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

/**
 * Compara una contraseña hasheada con una contraseña en texto plano.
 * @param {string} currentPassword - Contraseña en texto plano.
 * @param {string} expectedPassword - Contraseña hasheada.
 * @returns {Promise<boolean>} Indica si las contraseñas coinciden.
 */
const isValidPassword = async (currentPassword, expectedPassword) => {
    return await bcrypt.compare(currentPassword, expectedPassword);
};

module.exports = {
    validateUserData,
    returnUser,
    hashPassword,
    isValidPassword
}; 