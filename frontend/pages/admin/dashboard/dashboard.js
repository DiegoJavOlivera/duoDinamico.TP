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
async function loadMovements(page = 1) {
    // Llamar directamente a la función que está en productHandlers.js
    // Evitar usar window.loadMovements para prevenir recursión
    
    const loadingElement = document.getElementById('movements-loading');
    const listElement = document.getElementById('movementsList');
    const paginationElement = document.getElementById('movements-pagination');
    
    // Verificar que los elementos existan
    if (!loadingElement || !listElement) {
        console.log('Elementos del DOM de movimientos no encontrados, reintentando en 500ms...');
        setTimeout(() => loadMovements(page), 500);
        return;
    }
    
    try {
        // Mostrar loading
        loadingElement.style.display = 'flex';
        listElement.innerHTML = '';
        
        console.log('Cargando movimientos desde la API...');
        console.log('URL de la API:', `http://localhost:3000/api/admin/actions?page=${page}`);
        
        // Llamar directamente a la función del service
        const response = await getMovements(page);
        console.log('Respuesta de la API:', response);
        
        // Ocultar loading
        loadingElement.style.display = 'none';
        
        // Verificar si la respuesta es válida
        if (!response || typeof response !== 'object') {
            listElement.innerHTML = `
                <div class="coming-soon">
                    No hay movimientos disponibles
                </div>
            `;
            // Ocultar paginación si no hay datos
            if (paginationElement) {
                paginationElement.style.display = 'none';
            }
            return;
        }
        
        const movements = response.data || [];
        console.log('Movimientos cargados:', movements.length);
        
        // Verificar si no hay movimientos
        if (!movements || movements.length === 0) {
            listElement.innerHTML = `
                <div class="coming-soon">
                    No hay movimientos disponibles
                </div>
            `;
            // Ocultar paginación si no hay datos
            if (paginationElement) {
                paginationElement.style.display = 'none';
            }
            return;
        }
        
        // Llamar a la función de renderizado de productHandlers.js
        if (typeof renderMovements === 'function') {
            renderMovements(movements);
        } else {
            // Fallback si la función no está disponible
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
        
        // Renderizar paginación
        renderMovementsPagination(response.currentPage, response.totalPages, response.total);
        
    } catch (error) {
        console.error('Error detallado al cargar movimientos:', error);
        
        // Ocultar loading
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        
        // Verificar si el error es por falta de datos (no es un error real)
        if (error.message && (error.message.includes('404') || error.message.includes('No se encontraron'))) {
            listElement.innerHTML = `
                <div class="coming-soon">
                    No hay movimientos disponibles
                </div>
            `;
            // Ocultar paginación si no hay datos
            if (paginationElement) {
                paginationElement.style.display = 'none';
            }
            return;
        }
        
        // Solo mostrar error si es un error real (permisos, red, etc.)
        if (listElement) {
            listElement.innerHTML = `
                <div style="background: #2a1a1a; padding: 1.5rem; border-radius: 0.5rem; border: 1px solid #ff4444; color: #ff6666; text-align: center;">
                    <i class="bi bi-exclamation-triangle" style="font-size: 1.5rem; margin-bottom: 0.5rem; display: block;"></i> 
                    <strong>Error al cargar movimientos:</strong><br>
                    ${error.message}
                    <br><br>
                    <button class="btn primary" onclick="loadMovements(${page})" style="margin-top: 1rem;">
                        <i class="bi bi-arrow-clockwise"></i> Reintentar
                    </button>
                </div>
            `;
        }
        
        // Ocultar paginación en caso de error
        if (paginationElement) {
            paginationElement.style.display = 'none';
        }
    }
}

// Cargar tickets
async function loadTickets(page = 1) {
    const loadingElement = document.getElementById('tickets-loading');
    const listElement = document.getElementById('ticketsList');
    const paginationElement = document.getElementById('tickets-pagination');
    
    // Verificar que los elementos existan
    if (!listElement) {
        console.log('Elementos del DOM de tickets no encontrados, reintentando en 500ms...');
        setTimeout(() => loadTickets(page), 500);
        return;
    }
    
    try {
        // Mostrar loading
        if (loadingElement) {
            loadingElement.style.display = 'flex';
        } else {
            listElement.innerHTML = `
                <div class="loading">
                    <i class="bi bi-arrow-clockwise spin"></i> Cargando tickets...
                </div>
            `;
        }
        
        console.log('Cargando tickets desde la API...');
        console.log('URL de la API:', `http://localhost:3000/api/ticket?page=${page}`);
        
        // Llamar directamente a la función del service
        const response = await getTickets(page);
        console.log('Respuesta de la API:', response);
        
        // Ocultar loading
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        
        // Verificar si la respuesta es válida
        if (!response || typeof response !== 'object') {
            listElement.innerHTML = `
                <div class="coming-soon">
                    No hay tickets disponibles
                </div>
            `;
            // Ocultar paginación si no hay datos
            if (paginationElement) {
                paginationElement.style.display = 'none';
            }
            return;
        }
        
        const tickets = response.tickets || [];
        console.log('Tickets cargados:', tickets.length);
        
        // Verificar si no hay tickets
        if (!tickets || tickets.length === 0) {
            listElement.innerHTML = `
                <div class="coming-soon">
                    No hay tickets disponibles
                </div>
            `;
            // Ocultar paginación si no hay datos
            if (paginationElement) {
                paginationElement.style.display = 'none';
            }
            return;
        }
        
        // Llamar a la función de renderizado de productHandlers.js
        if (typeof renderTickets === 'function') {
            renderTickets(tickets);
        } else {
            // Fallback si la función no está disponible
            listElement.innerHTML = tickets.map(ticket => {
                const date = new Date(ticket.createdAt).toLocaleString('es-ES', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                return `
                    <div style="background: #1a1a1a; padding: 1rem; margin-bottom: 0.5rem; border-radius: 0.5rem; border: 1px solid #333;">
                        <div style="color: #ffd700; font-weight: bold;">Ticket: ${ticket.ticketCode}</div>
                        <div style="color: #ccc; font-size: 0.9rem; margin: 0.25rem 0;">Fecha: ${date}</div>
                        <div style="color: #fff; margin: 0.25rem 0;">Cliente: ${ticket.customerName}</div>
                        <div style="color: #fff; margin: 0.25rem 0;">Total: $${ticket.total}</div>
                        <div style="color: #aaa; font-size: 0.85rem;">Productos: ${ticket.products.length} items</div>
                    </div>
                `;
            }).join('');
        }
        
        // Renderizar paginación
        renderTicketsPagination(response.pagination.currentPage, response.pagination.totalPages, response.pagination.totalTickets);
        
    } catch (error) {
        console.error('Error detallado al cargar tickets:', error);
        
        // Ocultar loading
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        
        // Verificar si el error es por falta de datos (no es un error real)
        if (error.message && (error.message.includes('404') || error.message.includes('No se encontraron'))) {
            listElement.innerHTML = `
                <div class="coming-soon">
                    No hay tickets disponibles
                </div>
            `;
            // Ocultar paginación si no hay datos
            if (paginationElement) {
                paginationElement.style.display = 'none';
            }
            return;
        }
        
        // Solo mostrar error si es un error real (permisos, red, etc.)
        if (listElement) {
            listElement.innerHTML = `
                <div style="background: #2a1a1a; padding: 1.5rem; border-radius: 0.5rem; border: 1px solid #ff4444; color: #ff6666; text-align: center;">
                    <i class="bi bi-exclamation-triangle" style="font-size: 1.5rem; margin-bottom: 0.5rem; display: block;"></i> 
                    <strong>Error al cargar tickets:</strong><br>
                    ${error.message}
                    <br><br>
                    <button class="btn primary" onclick="loadTickets(${page})" style="margin-top: 1rem;">
                        <i class="bi bi-arrow-clockwise"></i> Reintentar
                    </button>
                </div>
            `;
        }
        
        // Ocultar paginación en caso de error
        if (paginationElement) {
            paginationElement.style.display = 'none';
        }
    }
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

// Renderizar paginación de movimientos
function renderMovementsPagination(currentPage, totalPages, totalItems) {
    const paginationElement = document.getElementById('movements-pagination');
    
    if (!paginationElement) {
        console.log('Elemento de paginación no encontrado');
        return;
    }
    
    // Mostrar información de paginación
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * 10 + 1;
    const endItem = Math.min(currentPage * 10, totalItems);
    
    let paginationHTML = `
        <div class="pagination-info">
            <span>Mostrando ${startItem} a ${endItem} de ${totalItems} movimientos</span>
        </div>
    `;
    
    // Solo mostrar botones de paginación si hay más de una página
    if (totalPages > 1) {
        paginationHTML += `
            <div class="pagination-buttons">
                <button class="btn ${currentPage === 1 ? 'disabled' : ''}" 
                        onclick="loadMovements(${currentPage - 1})" 
                        ${currentPage === 1 ? 'disabled' : ''}>
                    <i class="bi bi-chevron-left"></i> Anterior
                </button>
                
                <span class="page-info">
                    Página ${currentPage} de ${totalPages}
                </span>
                
                <button class="btn ${currentPage === totalPages ? 'disabled' : ''}" 
                        onclick="loadMovements(${currentPage + 1})" 
                        ${currentPage === totalPages ? 'disabled' : ''}>
                    Siguiente <i class="bi bi-chevron-right"></i>
                </button>
            </div>
        `;
    }
    
    paginationElement.innerHTML = paginationHTML;
    paginationElement.style.display = 'block';
}

// Renderizar paginación de tickets
function renderTicketsPagination(currentPage, totalPages, totalItems) {
    const paginationElement = document.getElementById('tickets-pagination');
    
    if (!paginationElement) {
        console.log('Elemento de paginación de tickets no encontrado');
        return;
    }
    
    // Mostrar información de paginación
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * 6 + 1;
    const endItem = Math.min(currentPage * 6, totalItems);
    
    let paginationHTML = `
        <div class="pagination-info">
            <span>Mostrando ${startItem} a ${endItem} de ${totalItems} tickets</span>
        </div>
    `;
    
    // Solo mostrar botones de paginación si hay más de una página
    if (totalPages > 1) {
        paginationHTML += `
            <div class="pagination-buttons">
                <button class="btn ${currentPage === 1 ? 'disabled' : ''}" 
                        onclick="loadTickets(${currentPage - 1})" 
                        ${currentPage === 1 ? 'disabled' : ''}>
                    <i class="bi bi-chevron-left"></i> Anterior
                </button>
                
                <span class="page-info">
                    Página ${currentPage} de ${totalPages}
                </span>
                
                <button class="btn ${currentPage === totalPages ? 'disabled' : ''}" 
                        onclick="loadTickets(${currentPage + 1})" 
                        ${currentPage === totalPages ? 'disabled' : ''}>
                    Siguiente <i class="bi bi-chevron-right"></i>
                </button>
            </div>
        `;
    }
    
    paginationElement.innerHTML = paginationHTML;
    paginationElement.style.display = 'block';
}