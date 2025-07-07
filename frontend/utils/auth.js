// auth.js - Funciones de autenticación reutilizables

// Funciones de utilidad para el token
function getAuthToken() {
    return sessionStorage.getItem('adminToken');
}

function getAuthUser() {
    const userJson = sessionStorage.getItem('adminUser');
    return userJson ? JSON.parse(userJson) : null;
}

function isAuthenticated() {
    return !!getAuthToken();
}

function clearAuthData() {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminUser');
}

// Verificar autenticación al cargar la página
function checkAuthentication() {
    if (!isAuthenticated()) {
        alert('Sesión expirada. Redirigiendo al login...');
        window.location.href = 'pages/admin/login/login.html';
        return false;
    }
    return true;
}

// Función para hacer peticiones autenticadas
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
function saveAuthData(token, user) {
    sessionStorage.setItem('adminToken', token);
    sessionStorage.setItem('adminUser', JSON.stringify(user));
}
