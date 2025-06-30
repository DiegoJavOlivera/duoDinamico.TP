const {SaleDetail} = require('../models');

const createSaleDetail = (saleDetailData) => SaleDetail.bulkCreate(saleDetailData);


module.exports = {
    createSaleDetail,
}
