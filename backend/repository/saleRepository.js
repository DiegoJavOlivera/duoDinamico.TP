const { Sale } = require('../models');


const createSale = (saleData) => Sale.create(saleData);


module.exports = {
    createSale,
}