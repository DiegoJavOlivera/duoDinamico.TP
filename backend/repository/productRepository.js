
const {Product} = require("../models/index");


const getAllProducts = () => Product.findAll();

const getProductById = (id) => Product.findByPk(id);

const addProduct = (productData) => Product.create(productData);

const getAllProductsById = (ids) => Product.findAll({
    where: {
        id: ids
    }
});  

const reduceStock = (id, quantity) => Product.decrement('stock',{
    by: quantity,
    where: {
        id: id
    }
});

module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    getAllProductsById,
    reduceStock
}