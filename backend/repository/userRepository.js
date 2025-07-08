
/**
 * @fileoverview Repositorio de usuarios.
 * Proporciona funciones para crear, consultar y buscar usuarios.
 */

const {User} = require("../models");

/**
 * Crea un nuevo usuario.
 * @param {Object} userData - Datos del usuario a crear.
 * @returns {Promise<User>} Usuario creado.
 */
const create = (userData) => User.create(userData);

/**
 * Verifica si un email ya existe.
 * @param {string} email - Email a buscar.
 * @returns {Promise<User|null>} Usuario encontrado o null.
 */
const checkEmailExists = (email) => User.findOne({ where: { email } });

/**
 * Obtiene todos los usuarios.
 * @returns {Promise<Array<User>>} Lista de usuarios.
 */
const getAllUsers = () => User.findAll();

/**
 * Busca un usuario por su ID (Primary Key).
 * @param {number|string} id - ID del usuario.
 * @returns {Promise<User|null>} Usuario encontrado o null.
 */
const findByPkCustom = (id) => User.findByPk(id);

module.exports = {
    create,
    checkEmailExists,
    getAllUsers,
    findByPkCustom
};  