
/**
 * @fileoverview Controlador de acciones para el módulo SuperAdmin.
 * Permite obtener acciones de usuario paginadas para auditoría o administración.
 */

const { getPaginatedActions } = require("../../repository/logRepository");

/**
 * Obtiene un listado paginado de acciones de usuario del sistema.
 *
 * - Permite filtrar por página (query param 'page').
 * - Devuelve total de acciones, total de páginas, página actual y los datos.
 *
 * @param {import('express').Request} req - Request HTTP (puede incluir ?page=N)
 * @param {import('express').Response} res - Response HTTP
 * @returns {Promise<void>} Responde con 200 y datos paginados, o error 404/500
 */
const getActions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const result = await getPaginatedActions({ page, limit });

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ message: "No se encontraron acciones" });
    }

    res.status(200).json({
      total: result.count,
      totalPages: Math.ceil(result.count / limit),
      currentPage: page,
      data: result.rows
    });

  } catch (error) {
    console.error("Error al obtener acciones:", error);
    res.status(500).json({ error: "Error al obtener los acciones" });
  }
};
module.exports = {
    getActions
};