/**
 * @fileoverview Repositorio de categorías.
 * Proporciona funciones para consultar categorías de productos.
 */

const { Category } = require('../models/index');

/**
 * Obtiene todas las categorías de productos.
 * @returns {Promise<Array<Category>>} Lista de categorías.
 */
const getAllCategories = async () => {
    return await Category.findAll();
};

module.exports = {
    getAllCategories
};