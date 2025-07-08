
/**
 * Obtiene las subcategorías de una categoría específica desde la API backend.
 *
 * @param {number|string} categoryId - ID de la categoría.
 * @returns {Promise<Array>} Array de subcategorías obtenidas del backend.
 */
async function getSubcategoryByCategoryId(categoryId) {
  return await apiFetch(`subcategories/${categoryId}`);
}