
const { Sale } = require('../models');


const createSale = (saleData) => Sale.create(saleData);

const getAllSales = async (page = 1, limit = 6) => {
    const offset = (page - 1) * limit;
    
    // Primero obtenemos el conteo total sin includes para evitar problemas con distinct
    const totalCount = await Sale.count();
    
    // Luego obtenemos los datos con paginación
    const sales = await Sale.findAll({
        attributes: ['ticket_code', 'customer_name', 'total', 'created_at'],
        include:[
            {
                association: 'SaleDetails',
                attributes: ['quantity', 'subtotal'],
                include: [
                    {
                        association: 'Product',
                        attributes: ['name', 'price']
                    }
                ]
            }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
    });
    
    return {
        count: totalCount,
        rows: sales
    };
}

module.exports = {
    createSale,
    getAllSales
}