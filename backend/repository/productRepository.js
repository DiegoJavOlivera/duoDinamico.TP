const {Product} = require("../models/index");
const { validateProductId, validateProductData } = require("../utils/productUtil");

const getAllProducts = async () => {
    try {
        const products = await Product.findAll();
        validateProductData(products);
        return products;
    } catch (error) {
        throw new Error(error.message);
    }
}

const getProductById = async (id) => {
    try {
        validateProductId(id);
        const product = await Product.findByPk(id);
        validateProductData([product]);
        return product;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    getAllProducts,
    getProductById
}