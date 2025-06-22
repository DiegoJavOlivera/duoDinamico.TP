const {Product} = require("../models/index");


const getAllProducts = (all=true, subcategory='') => { 
    const where = {};

    if(!all) {
        where.is_active = true;
    }

    if(subcategory) {
        where.subcategory_id = subcategory;
    }
    
    return Product.findAll({ where }) 
};

const getProductById = (id) => Product.findByPk(id);

const addProduct = (productData) => Product.create(productData);

module.exports = {
    getAllProducts,
    getProductById,
    addProduct
}