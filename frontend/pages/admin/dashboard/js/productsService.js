// productsService.js - Servicios para interactuar con el backend de productos

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Obtener todos los productos del backend
 * @returns {Promise<Array>} Lista de productos
 */
async function getProducts() {
    const response = await authenticatedFetch(`${API_BASE_URL}/products`);
    return await response.json();
}

/**
 * Crear un nuevo producto
 * @param {Object} productData - Datos del producto
 * @returns {Promise<Object>} Producto creado
 */
async function createProduct(productData) {
    const response = await authenticatedFetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el producto');
    }
    
    return await response.json();
}

/**
 * Actualizar un producto existente
 * @param {number} productId - ID del producto
 * @param {Object} productData - Datos actualizados del producto
 * @returns {Promise<Object>} Producto actualizado
 */
async function updateProduct(productId, productData) {
    const response = await authenticatedFetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el producto');
    }
    
    return await response.json();
}

/**
 * Eliminar un producto
 * @param {number} productId - ID del producto a eliminar
 * @returns {Promise<void>}
 */
async function deleteProductById(productId) {
    const response = await authenticatedFetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE'
    });
    
    if (!response.ok) {
        throw new Error('Error al eliminar el producto');
    }
}
