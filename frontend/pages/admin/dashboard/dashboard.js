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
    
    // Aplicar permisos según el rol del usuario
    applyUserPermissions();
    
    // Intentar cargar productos inmediatamente
    setTimeout(() => {
        loadProducts();
        initializeForms();
        // Aplicar permisos con un pequeño delay
        setTimeout(applyUserPermissions, 200);
    }, 100);
    
    // También cargar después de incluir HTML como respaldo
    includeHTML(() => {
        // Cargar productos cuando se inicializa la página
        loadProducts();
        // Inicializar formularios
        initializeForms();
        // Aplicar permisos después de cargar el HTML
        applyUserPermissions();
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
            renderTickets();
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
async function loadMovements() {
    // Llamar directamente a la función que está en productHandlers.js
    // Evitar usar window.loadMovements para prevenir recursión
    
    const loadingElement = document.getElementById('movements-loading');
    const listElement = document.getElementById('movementsList');
    
    // Verificar que los elementos existan
    if (!loadingElement || !listElement) {
        console.log('Elementos del DOM de movimientos no encontrados, reintentando en 500ms...');
        setTimeout(loadMovements, 500);
        return;
    }
    
    try {
        // Mostrar loading
        loadingElement.style.display = 'flex';
        listElement.innerHTML = '';
        
        console.log('Cargando movimientos desde la API...');
        console.log('URL de la API:', `http://localhost:3000/api/admin/actions?page=1`);
        
        // Llamar directamente a la función del service
        const response = await getMovements(1);
        console.log('Respuesta de la API:', response);
        
        const movements = response.data || [];
        console.log('Movimientos cargados:', movements.length);
        
        // Ocultar loading
        loadingElement.style.display = 'none';
        
        // Llamar a la función de renderizado de productHandlers.js
        if (typeof renderMovements === 'function') {
            renderMovements(movements);
        } else {
            // Fallback si la función no está disponible
            if (!movements || movements.length === 0) {
                listElement.innerHTML = `
                    <div class="coming-soon">
                        No hay movimientos disponibles
                    </div>
                `;
                return;
            }
            
            listElement.innerHTML = movements.map(movement => {
                const date = new Date(movement.created_at).toLocaleString('es-ES', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                const productInfo = movement.Product ? 
                    `<strong>Producto:</strong> ${movement.Product.name} (ID: ${movement.Product.id})` : 
                    '';
                
                return `
                    <div style="background: #1a1a1a; padding: 1rem; margin-bottom: 0.5rem; border-radius: 0.5rem; border: 1px solid #333;">
                        <div style="color: #ffd700; font-weight: bold;">ID: ${movement.id}</div>
                        <div style="color: #ccc; font-size: 0.9rem; margin: 0.25rem 0;">Fecha: ${date}</div>
                        <div style="color: #fff; margin: 0.25rem 0;">Usuario: ${movement.User.name}</div>
                        <div style="color: #fff; margin: 0.25rem 0;">Acción: ${movement.Action.name}</div>
                        ${productInfo ? `<div style="color: #aaa; font-size: 0.85rem;">${productInfo}</div>` : ''}
                    </div>
                `;
            }).join('');
        }
        
    } catch (error) {
        console.error('Error detallado al cargar movimientos:', error);
        
        // Ocultar loading
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        
        if (listElement) {
            listElement.innerHTML = `
                <div style="background: #2a1a1a; padding: 1.5rem; border-radius: 0.5rem; border: 1px solid #ff4444; color: #ff6666; text-align: center;">
                    <i class="bi bi-exclamation-triangle" style="font-size: 1.5rem; margin-bottom: 0.5rem; display: block;"></i> 
                    <strong>Error al cargar movimientos, puede que no tengas permisos:</strong><br>
                    ${error.message}
                    <br><br>
                    <button class="btn primary" onclick="loadMovements()" style="margin-top: 1rem;">
                        <i class="bi bi-arrow-clockwise"></i> Reintentar
                    </button>
                </div>
            `;
        }
    }
}

// Cargar tickets
async function loadTickets() {
    const ticketsList = document.getElementById('ticketsList');
    ticketsList.innerHTML = `
        <div class="loading">
            <i class="bi bi-arrow-clockwise spin"></i> Cargando tickets...
        </div>
    `;
    
    // TODO: Implementar carga desde backend
    // const response = await authenticatedFetch('http://localhost:3000/api/tickets');
}

// Exportar tickets
function exportTickets() {
    console.log('Exportar tickets');
    alert('Funcionalidad de exportación por implementar');
}

// Aplicar permisos según el rol del usuario
function applyUserPermissions() {
    const user = getAuthUser();
    
    if (!user) {
        console.error('No se pudo obtener información del usuario');
        return;
    }
    
    console.log('Aplicando permisos para usuario ID:', user.id);
    
    // Si es admin regular (ID: 2), ocultar funcionalidades restringidas
    if (isAdmin()) {
        // Ocultar tabs restringidos
        hideTabButton('add-user');
        hideTabButton('movements'); 
        hideTabButton('tickets');
        
        // Ocultar tabs de contenido restringido
        hideTabContent('add-user-tab');
        hideTabContent('movements-tab');
        hideTabContent('tickets-tab');
        
        console.log('Permisos de admin regular aplicados - funcionalidades restringidas ocultas');
    } else if (isSuperAdmin()) {
        console.log('Usuario superadmin - acceso completo');
    } else {
        console.warn('ID de usuario no reconocido:', user.id);
    }
}

// Función auxiliar para ocultar botones de tab
function hideTabButton(tabName) {
    const button = document.querySelector(`[onclick="switchTab('${tabName}')"]`);
    if (button) {
        button.style.display = 'none';
        console.log(`Tab button '${tabName}' ocultado`);
    }
}

// Función auxiliar para ocultar contenido de tab
function hideTabContent(tabId) {
    const tabContent = document.getElementById(tabId);
    if (tabContent) {
        tabContent.style.display = 'none';
        console.log(`Tab content '${tabId}' ocultado`);
    }
}