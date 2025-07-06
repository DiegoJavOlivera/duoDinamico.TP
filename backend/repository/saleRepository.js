
const { Sale } = require('../models');


const createSale = (saleData) => Sale.create(saleData);

const getAllSales = () => Sale.findAll({
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

    ] 
})

module.exports = {
    createSale,
    getAllSales
}