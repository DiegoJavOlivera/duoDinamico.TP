const { Category } = require('../models/index');

const getAllCategories = async () => {
    return await Category.findAll();
};

module.exports = {
    getAllCategories
};