
const { Subcategory } = require("../models/index");

const getSubcategory = (category_id) => {
    return Subcategory.findAll({ where: { category_id } });
};

module.exports = getSubcategory;
