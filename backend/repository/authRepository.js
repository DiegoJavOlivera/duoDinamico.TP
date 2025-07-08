/**
 * @fileoverview Repositorio de autenticación de usuarios.
 * Proporciona funciones para consultar usuarios en base a credenciales.
 */

const { User } = require("../models");

/**
 * Busca un usuario por email.
 * @param {string} email - Email del usuario a buscar.
 * @returns {Promise<User|null>} Usuario encontrado o null si no existe.
 */
const findUserByEmail = (email) => User.findOne({ where:{ email }});

module.exports = {
    findUserByEmail,
}