// productsService.js - Servicios para interactuar con el backend de productos

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Obtener todos los productos del backend
 * @returns {Promise<Array>} Lista de productos
 */
async function getProducts() {
    const response = await authenticatedFetch(`${API_BASE_URL}/products?all=true`);
    return await response.json();
}

/**
 * Crear un nuevo producto
 * @param {FormData} formData - FormData con los datos del producto (incluyendo imagen)
 * @returns {Promise<Object>} Producto creado
 */
async function createProduct(formData) {
    const token = getAuthToken();
    
    if (!token) {
        throw new Error('No hay token de autenticación');
    }
    
    // Para FormData, NO especificamos Content-Type para que el navegador configure el boundary automáticamente
    const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });
    
    // Si el token ha expirado (401), manejar el error de autenticación
    if (response.status === 401) {
        clearAuthData();
        alert('Sesión expirada. Redirigiendo al login...');
        window.location.href = 'pages/admin/login/login.html';
        throw new Error('Token expirado');
    }
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el producto');
    }
    
    return await response.json();
}

/**
 * Actualizar un producto existente
 * @param {number} productId - ID del producto
 * @param {FormData|Object} productData - FormData si incluye imagen, Object si es solo datos
 * @returns {Promise<Object>} Producto actualizado
 */
async function updateProduct(productId, productData) {
    const token = getAuthToken();
    
    if (!token) {
        throw new Error('No hay token de autenticación');
    }
    
    let requestConfig;
    
    // Si es FormData (incluye imagen), usar fetch manual
    if (productData instanceof FormData) {
        requestConfig = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
                // NO especificar Content-Type para FormData
            },
            body: productData
        };
        
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, requestConfig);
        
        // Manejar autenticación
        if (response.status === 401) {
            clearAuthData();
            alert('Sesión expirada. Redirigiendo al login...');
            window.location.href = 'pages/admin/login/login.html';
            throw new Error('Token expirado');
        }
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al actualizar el producto');
        }
        
        return await response.json();
    } else {
        // Si es objeto normal (sin imagen), usar authenticatedFetch
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
}

/**
 * Eliminar un producto
 * @param {number} productId - ID del producto a eliminar
 * @returns {Promise<void>}
 */
async function deleteProductById(productId) {
    const response = await authenticatedFetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PATCH' // Usamos PATCH para cambiar el estado a inactivo
    });
    
    if (!response.ok) {
        throw new Error('Error al eliminar el producto');
    }
}

/**
 * Obtener todas las subcategorías con sus categorías incluidas
 * @returns {Promise<Array>} Lista de subcategorías con información de categoría
 */
async function getAllSubcategories() {
    const response = await authenticatedFetch(`${API_BASE_URL}/subcategories`);
    return await response.json();
}

/**
 * Obtener todas las categorías únicas desde las subcategorías
 * @returns {Promise<Array>} Lista de categorías únicas
 */
async function getCategories() {
    const subcategories = await getAllSubcategories();
    
    // Extraer categorías únicas
    const categoriesMap = new Map();
    subcategories.forEach(subcategory => {
        if (subcategory.Category && !categoriesMap.has(subcategory.Category.id)) {
            categoriesMap.set(subcategory.Category.id, {
                id: subcategory.Category.id,
                name: subcategory.Category.name
            });
        }
    });
    
    return Array.from(categoriesMap.values());
}

/**
 * Obtener subcategorías filtradas por ID de categoría
 * @param {number} categoryId - ID de la categoría
 * @returns {Promise<Array>} Lista de subcategorías de la categoría especificada
 */
async function getSubcategoriesByCategory(categoryId) {
    const allSubcategories = await getAllSubcategories();
    return allSubcategories.filter(subcategory => subcategory.category_id === parseInt(categoryId));
}

/**
 * Obtener movimientos/acciones del sistema con paginación
 * @param {number} page - Página actual (opcional, por defecto 1)
 * @returns {Promise<Object>} Objeto con total, totalPages, currentPage y data con los movimientos
 */
async function getMovements(page = 1) {
    const response = await authenticatedFetch(`${API_BASE_URL}/admin/actions?page=${page}`);
    
    // Si es 404, significa que no hay movimientos, no es un error
    if (response.status === 404) {
        return {
            data: [],
            total: 0,
            totalPages: 0,
            currentPage: page
        };
    }
    
    if (!response.ok) {
        throw new Error('Error al obtener los movimientos');
    }
    
    return await response.json();
}

/**
 * Obtener todos los movimientos (carga todas las páginas)
 * @returns {Promise<Object>} Objeto con todos los movimientos
 */
async function getAllMovements() {
    try {
        // Primero obtenemos la primera página para saber el total
        const firstPage = await getMovements(1);
        let allMovements = [...firstPage.data];
        
        // Si hay más de una página, obtenemos el resto
        if (firstPage.totalPages > 1) {
            const promises = [];
            for (let page = 2; page <= firstPage.totalPages; page++) {
                promises.push(getMovements(page));
            }
            
            const remainingPages = await Promise.all(promises);
            remainingPages.forEach(pageData => {
                allMovements = allMovements.concat(pageData.data);
            });
        }
        
        return {
            total: firstPage.total,
            totalPages: firstPage.totalPages,
            currentPage: 1,
            data: allMovements
        };
    } catch (error) {
        throw new Error('Error al obtener todos los movimientos: ' + error.message);
    }
}


/**
 * Obtener todos los tickets del backend
 * @returns {Promise<Array>} Lista de tickets
 */
async function getAllTickets() {
    const response = await authenticatedFetch(`${API_BASE_URL}/ticket`);
    
    // Si es 404, significa que no hay tickets, no es un error
    if (response.status === 404) {
        return [];
    }
    
    if (!response.ok) {
        throw new Error('Error al obtener los tickets');
    }
    
    return await response.json();
}


