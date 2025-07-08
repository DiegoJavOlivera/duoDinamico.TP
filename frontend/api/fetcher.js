/**
 * URL base para todas las peticiones a la API backend.
 * Cambia esta constante si el backend está en otro host o puerto.
 */
const BASE_URL = 'http://localhost:3000/api/';

/**
 * Realiza una petición HTTP a la API backend usando fetch.
 *
 * - Usa BASE_URL como prefijo.
 * - Por defecto usa método GET y Content-Type JSON.
 * - Lanza error si la respuesta no es exitosa.
 *
 * @param {string} endpoint - Ruta de la API (ej: 'products').
 * @param {Object} [options] - Opciones de la petición (method, headers, body).
 * @param {string} [options.method='GET'] - Método HTTP.
 * @param {Object} [options.headers={}] - Headers adicionales.
 * @param {Object} [options.body] - Body de la petición (se serializa a JSON).
 * @returns {Promise<Object>} Respuesta parseada en JSON.
 * @throws {Error} Si la respuesta no es exitosa.
 */
const apiFetch = async (endpoint, { method = 'GET', headers = {}, body } = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      ...(body && { body: JSON.stringify(body) })
    });
  
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }
    return response.json();
}
