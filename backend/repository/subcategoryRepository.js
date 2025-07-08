
/**
 * @fileoverview Repositorio de subcategorías.
 * Permite consultar subcategorías por categoría o todas.
 */

const { Subcategory } = require("../models/index");

/**
 * Obtiene subcategorías por ID de categoría o todas si no se especifica.
 * @param {string|number} [category_id] - ID de la categoría.
 * @returns {Promise<Array<Subcategory>>} Lista de subcategorías.
 */
const getSubcategory = (category_id = '') => {
    if(!category_id){
        return Subcategory.findAll({
            include: [
                {
                    association: "Category",
                    attributes: ['id', 'name']
                }
            ]
        });
    }
    return Subcategory.findAll({ where: { category_id } });
};

module.exports = { getSubcategory };
