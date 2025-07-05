

const {Product} = require("../models/index");


const getAllProducts = (all=true, subcategory='') => { 
    const where = {};

    if(!all) {
        where.is_active = true;
    }

    if(subcategory) {
        where.subcategory_id = subcategory;
    }
    
    return Product.findAll({ where,
        include:[
            {
                association: "Subcategory",
                attributes: ['id', 'name'],
                include:[
                    {
                        association: "Category",
                        attributes: ['id', 'name']
                    }
                ]
            }
        ]
     }) 
};

const getProductById = (id) => Product.findByPk(id);

const addProduct = (productData) => Product.create(productData);

const getAllProductsById = (ids) => Product.findAll({
    where: {
        id: ids
    }
});  

const updateProduct = (id, productData) => Product.update(productData, {
    where: {
        id: id
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
    reduceStock,
    updateProduct
}