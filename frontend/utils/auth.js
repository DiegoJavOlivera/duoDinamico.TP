// auth.js - Funciones de autenticación reutilizables

// Funciones de utilidad para el token
/**
 * Obtiene el token de autenticación del sessionStorage.
 *
 * @returns {string|null} Token JWT o null si no existe.
 */
function getAuthToken() {
    return sessionStorage.getItem('adminToken');
}

/**
 * Obtiene el usuario autenticado desde sessionStorage.
 *
 * @returns {Object|null} Objeto usuario o null si no existe.
 */
function getAuthUser() {
    const userJson = sessionStorage.getItem('adminUser');
    return userJson ? JSON.parse(userJson) : null;
}

/**
 * Verifica si el usuario está autenticado (si hay token).
 *
 * @returns {boolean} true si hay token, false si no.
 */
function isAuthenticated() {
    return !!getAuthToken();
}

/**
 * Elimina los datos de autenticación del sessionStorage.
 */
function clearAuthData() {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminUser');
}

// Verificar autenticación al cargar la página
/**
 * Verifica si el usuario está autenticado al cargar la página. Si no, redirige al login.
 *
 * @returns {boolean} true si autenticado, false si no.
 */
function checkAuthentication() {
    if (!isAuthenticated()) {
        alert('Sesión expirada. Redirigiendo al login...');
        window.location.href = 'pages/admin/login/login.html';
        return false;
    }
    return true;
}

// Función para hacer peticiones autenticadas
/**
 * Realiza una petición fetch autenticada usando el token JWT.
 *
 * - Agrega el header Authorization.
 * - Si el token expiró, limpia los datos y redirige al login.
 *
 * @param {string} url - URL a la que se hace la petición.
 * @param {Object} [options] - Opciones fetch (headers, body, etc).
 * @returns {Promise<Response>} Respuesta de fetch.
 * @throws {Error} Si no hay token o si expira.
 */
async function authenticatedFetch(url, options = {}) {
    const token = getAuthToken();
    
    if (!token) {
        throw new Error('No hay token de autenticación');
    }
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    
    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };
    
    const response = await fetch(url, config);
    
    // Si el token ha expirado (401), redirigir al login
    if (response.status === 401) {
        clearAuthData();
        alert('Sesión expirada. Redirigiendo al login...');
        window.location.href = 'pages/admin/login/login.html';
        throw new Error('Token expirado');
    }
    
    return response;
}

// Función para guardar datos de autenticación después del login
/**
 * Guarda el token y el usuario autenticado en sessionStorage.
 *
 * @param {string} token - Token JWT.
 * @param {Object} user - Objeto usuario.
 */
function saveAuthData(token, user) {
    sessionStorage.setItem('adminToken', token);
    sessionStorage.setItem('adminUser', JSON.stringify(user));
}

// Verificar si el usuario es superadmin
/**
 * Verifica si el usuario autenticado es superadmin.
 *
 * @returns {boolean} true si es superadmin, false si no.
 */
function isSuperAdmin() {
    const user = getAuthUser();
    return user && user.id === 1;
}

// Verificar si el usuario es admin regular
/**
 * Verifica si el usuario autenticado es admin regular.
 *
 * @returns {boolean} true si es admin, false si no.
 */
function isAdmin() {
    const user = getAuthUser();
    return user && user.id === 2;
}
