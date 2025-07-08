// nameCostumer, products, total 
/**
 * Crea un ticket de compra enviando los datos al backend.
 *
 * @param {Object} data - Datos del ticket (nombre cliente, productos, total, etc).
 * @returns {Promise<Object>} Ticket creado (respuesta del backend).
 */
const createTicket = async (data) => {
    return await apiFetch('ticket/', { method: 'POST', body: data });
};
