

/**
 * @fileoverview Repositorio de productos.
 * Proporciona funciones para consultar y manipular productos en la base de datos.
 */

const {Product} = require("../models/index");

/**
 * Obtiene todos los productos, con opción de filtrar por subcategoría y estado activo.
 * @param {boolean} [all=true] - Si es false, solo productos activos.
 * @param {string|number} [subcategory=''] - ID de subcategoría para filtrar.
 * @returns {Promise<Array<Product>>} Lista de productos.
 */
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

/**
 * Busca un producto por su ID.
 * @param {number|string} id - ID del producto.
 * @returns {Promise<Product|null>} Producto encontrado o null.
 */
const getProductById = (id) => Product.findByPk(id);

/**
 * Crea un nuevo producto.
 * @param {Object} productData - Datos del producto a crear.
 * @returns {Promise<Product>} Producto creado.
 */
const addProduct = (productData) => Product.create(productData);

/**
 * Obtiene múltiples productos por un array de IDs.
 * @param {Array<number|string>} ids - IDs de productos.
 * @returns {Promise<Array<Product>>} Lista de productos encontrados.
 */
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