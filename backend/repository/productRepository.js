const {Product} = require("../models/index");


const getAllProducts = () => Product.findAll();

const getProductById = (id) => Product.findByPk(id);

const addProduct = (productData) => Product.create(productData);

module.exports = {
    getAllProducts,
    getProductById,
    addProduct
}