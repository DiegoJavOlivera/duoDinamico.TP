/**
 * @fileoverview Repositorio de detalles de venta.
 * Permite registrar los detalles de cada venta (productos, cantidades, subtotales).
 */

const {SaleDetail} = require('../models');

/**
 * Registra múltiples detalles de venta.
 * @param {Array<Object>} saleDetailData - Detalles de venta a registrar.
 * @returns {Promise<Array<SaleDetail>>} Detalles creados.
 */
const createSaleDetail = (saleDetailData) => SaleDetail.bulkCreate(saleDetailData);

module.exports = {
    createSaleDetail,
}
