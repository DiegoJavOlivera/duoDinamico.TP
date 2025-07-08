
/**
 * Obtiene la lista de productos desde la API backend, con filtros opcionales.
 *
 * @param {Object} [params] - Filtros para la consulta (ej: categoría, búsqueda, paginación).
 * @returns {Promise<Array>} Array de productos obtenidos del backend.
 */
function getProducts(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`products?${query}`);
}

/**
 * Obtiene un producto por su ID desde la API backend.
 *
 * @param {number|string} id - ID del producto a buscar.
 * @returns {Promise<Object>} Producto obtenido del backend.
 */
function getProductById(id) {
  return apiFetch(`products/${id}`);
}