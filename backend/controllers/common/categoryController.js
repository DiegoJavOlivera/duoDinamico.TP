const { getAllCategories } = require("../../repository/categoryRepository.js");
const { isAllValid } = require("../../utils/commons");

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