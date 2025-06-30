
const getSubcategory = require("../../repository/subcategoryRepository");

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

module.exports = getSubcategoryByCategory;