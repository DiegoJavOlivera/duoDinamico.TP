/**
 * @fileoverview Repositorio de logs de acciones de usuario.
 * Permite registrar y consultar logs de acciones en la plataforma.
 */

const { UserActionLog } = require('../models/index');

/**
 * Registra un nuevo log de acción de usuario.
 * @param {Object} data - Datos del log a registrar.
 * @returns {Promise<UserActionLog>} Log creado.
 */
const addLog = (data) => UserActionLog.create(data);

/**
 * Obtiene logs paginados de acciones de usuario.
 * @param {Object} params
 * @param {number} params.page - Página a consultar.
 * @param {number} params.limit - Cantidad de logs por página.
 * @returns {Promise<{count: number, rows: Array<UserActionLog>}>} Resultado paginado.
 */
const getPaginatedActions = ({ page = 1, limit = 20 }) => {
  const offset = (page - 1) * limit;

  return UserActionLog.findAndCountAll({
    attributes: ['id', 'created_at'],
    include: [
      {
        association: 'User',
        attributes: ['name']
      },
      {
        association: 'Product',
        attributes: ['id', 'name']
      },
      {
        association: 'Action',
        attributes: ['name']
      }
    ],
    limit,
    offset,
    order: [['created_at', 'DESC']]
  });
};

module.exports = {
    addLog,
    getPaginatedActions
};