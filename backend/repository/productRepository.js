const {Product} = require("../models/index");


const getAllProducts = () => Product.findAll();

const getProductById = (id) => Product.findByPk(id);

module.exports = {
    getAllProducts,
    getProductById
}