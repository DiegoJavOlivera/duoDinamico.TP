const { getAllCategories } = require("../../repository/categoryRepository.js");
const { isAllValid } = require("../../utils/commons");

/**
 * Obtiene todas las categorías disponibles.
 *
 * @param {import('express').Request} req - Request HTTP
 * @param {import('express').Response} res - Response HTTP
 * @returns {Promise<void>} Responde con 200 y array de categorías, 404 si no hay, 500 si hay error
 */
const getCategories = async (req, res) => {
    try {
        const categories = await getAllCategories();
        if(!isAllValid(categories)){
            res.status(404).json({ message: "No categories found" });
        }
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCategories
};