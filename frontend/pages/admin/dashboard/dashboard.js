// dashboard.js - Archivo principal del dashboard

document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación antes de cargar la página
    if (!checkAuthentication()) {
        return;
    }
    
    // Mostrar información del usuario
    const user = getAuthUser();
    if (user) {
        console.log('Usuario logueado:', user.email);
    }
    
    // Intentar cargar productos inmediatamente
    setTimeout(() => {
        loadProducts();
        initializeForms();
    }, 100);
    
    // También cargar después de incluir HTML como respaldo
    includeHTML(() => {
        // Cargar productos cuando se inicializa la página
        loadProducts();
        // Inicializar formularios
        initializeForms();
    });
    
    // Inicializar manejadores de archivos
    initializeFileInputs();
});

// Función para cambiar entre tabs
function switchTab(tabName) {
    // Ocultar todos los tab-panes
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabPanes.forEach(pane => pane.classList.remove('active'));
    
    // Remover clase active de todos los botones
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Mostrar el tab seleccionado
    const selectedTab = document.getElementById(`${tabName}-tab`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Activar el botón correspondiente
    const activeButton = document.querySelector(`[onclick="switchTab('${tabName}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Cargar datos específicos según el tab
    switch(tabName) {
        case 'products-list':
            loadProducts();
            break;
        case 'movements':
            loadMovements();
            break;
        case 'tickets':
            loadTickets();
            break;
    }
}

// Función para cerrar sesión
function logout() {
    // Limpiar datos de autenticación
    clearAuthData();
    // Redirigir al login
    window.location.href = '../login/login.html';
}

// Cargar movimientos
function loadMovements() {
    const movementsList = document.getElementById('movementsList');
    movementsList.innerHTML = `
        <div class="loading">
            <i class="bi bi-arrow-clockwise spin"></i> Cargando movimientos...
        </div>
    `;
    
    // TODO: Implementar carga desde backend
    // const response = await authenticatedFetch('http://localhost:3000/api/movements');
}

// Cargar tickets
function loadTickets() {
    const ticketsList = document.getElementById('ticketsList');
    ticketsList.innerHTML = `
        <div class="loading">
            <i class="bi bi-arrow-clockwise spin"></i> Cargando tickets...
        </div>
    `;
    
    // TODO: Implementar carga desde backend
    // const response = await authenticatedFetch('http://localhost:3000/api/tickets');
}

// Filtrar movimientos por fecha
function filterMovements() {
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    
    console.log('Filtrar movimientos desde:', dateFrom, 'hasta:', dateTo);
    // Aquí implementarías la lógica de filtrado
}

// Exportar tickets
function exportTickets() {
    console.log('Exportar tickets');
    alert('Funcionalidad de exportación por implementar');
}