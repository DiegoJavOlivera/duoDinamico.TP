

/**
 * Obtiene la lista de categorías desde la API backend.
 *
 * @returns {Promise<Array>} Array de categorías obtenidas del backend.
 */
async function getCategories() {
    return await apiFetch(`categories`);
}