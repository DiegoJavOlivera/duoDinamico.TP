
const { getSubcategory } = require("../../repository/subcategoryRepository");


/**
 * Obtiene subcategorías filtradas por categoría.
 *
 * @param {import('express').Request} req - Request HTTP (requiere param category_id)
 * @param {import('express').Response} res - Response HTTP
 * @returns {Promise<void>} Responde con 200 y subcategorías, 404 si no hay, 500 si hay error
 */
const getSubcategoryByCategory = async (req, res) => {
    try {
        const { category_id } = req.params;
        const subcategory = await getSubcategory(category_id);

        if (!subcategory) {
            res.status(404).json({ message: "Subcategory not found" });
        }
        res.status(200).json(subcategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Obtiene todas las subcategorías disponibles.
 *
 * @param {import('express').Request} req - Request HTTP
 * @param {import('express').Response} res - Response HTTP
 * @returns {Promise<void>} Responde con 200 y array de subcategorías, 404 si no hay, 500 si hay error
 */
const getSubcategories = async (req, res) => {
    try {
        const subcategories = await getSubcategory();
        if (!subcategories || subcategories.length === 0) {
            return res.status(404).json({ message: "No subcategories found" });
        }
        res.status(200).json(subcategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSubcategories,
    getSubcategoryByCategory
};