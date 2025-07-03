// dashboard.js

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
        if (productsData.length === 0) {
            loadProducts();
        }
        // Inicializar formularios
        initializeForms();
    });
});

// Variable global para almacenar los productos
let productsData = [];

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
            if (productsData.length === 0) {
                loadProducts();
            }
            break;
        case 'movements':
            loadMovements();
            break;
        case 'tickets':
            loadTickets();
            break;
    }
}

// Función para cargar productos desde la API
async function loadProducts() {
    const loadingElement = document.getElementById('products-loading');
    const gridElement = document.getElementById('products-grid');
    
    // Verificar que los elementos existan
    if (!loadingElement || !gridElement) {
        console.log('Elementos del DOM no encontrados, reintentando en 500ms...');
        setTimeout(loadProducts, 500);
        return;
    }
    
    try {
        // Mostrar loading
        loadingElement.style.display = 'flex';
        gridElement.innerHTML = '';
        
        console.log('Cargando productos desde la API...');
        
        // Realizar petición autenticada a la API
        const response = await authenticatedFetch('http://localhost:3000/api/products');
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const products = await response.json();
        productsData = products;
        
        console.log('Productos cargados:', products.length);
        
        // Ocultar loading
        loadingElement.style.display = 'none';
        
        // Mostrar productos
        displayProducts(products);
        
    } catch (error) {
        console.error('Error al cargar productos:', error);
        if (loadingElement) {
            loadingElement.innerHTML = `
                <i class="bi bi-exclamation-triangle"></i> 
                Error al cargar productos: ${error.message}
                <button class="btn primary" onclick="loadProducts()" style="margin-left: 1rem;">
                    <i class="bi bi-arrow-clockwise"></i> Reintentar
                </button>
            `;
        }
    }
}

// Función para mostrar productos en el grid
function displayProducts(products) {
    const gridElement = document.getElementById('products-grid');
    
    if (!products || products.length === 0) {
        gridElement.innerHTML = `
            <div class="coming-soon" style="grid-column: 1 / -1;">
                No hay productos disponibles
            </div>
        `;
        return;
    }
    
    gridElement.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="card-main">
                <div class="product-image-section">
                    ${product.image ? `
                        <div class="product-image">
                            <img src="${product.image}" alt="${escapeHtml(product.name)}" onerror="this.parentElement.style.display='none'">
                            <div class="product-status-overlay ${product.is_active ? 'active' : 'inactive'}">
                                ${product.is_active ? 'ACTIVE' : 'INACTIVE'}
                            </div>
                        </div>
                    ` : `
                        <div class="product-image no-image">
                            <i class="bi bi-image"></i>
                            <div class="product-status-overlay ${product.is_active ? 'active' : 'inactive'}">
                                ${product.is_active ? 'ACTIVE' : 'INACTIVE'}
                            </div>
                        </div>
                    `}
                </div>
                
                <div class="product-details-section">
                    <div class="product-header">
                        <div class="product-title-area">
                            <h3 class="product-title">${escapeHtml(product.name)}</h3>
                            <p class="product-description">${escapeHtml(product.description || 'Sin descripción disponible')}</p>
                        </div>
                        <div class="product-price">$${parseFloat(product.price).toFixed(2)}</div>
                    </div>
                    
                    <div class="product-info-row">
                        <div class="info-item">
                            <span class="info-icon"><i class="bi bi-box"></i></span>
                            <span class="info-text">
                                <span class="info-label">Stock</span>
                                <span class="info-value">${product.stock} unidades</span>
                            </span>
                        </div>
                        <div class="info-item">
                            <span class="info-icon"><i class="bi bi-tag"></i></span>
                            <span class="info-text">
                                <span class="info-label">Categoría</span>
                                <span class="info-value">${product.subcategory_id}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="product-actions">
                <button class="action-btn edit-btn" onclick="editProduct(${product.id})" title="Editar producto">
                    <i class="bi bi-pencil-square"></i>
                    <span>Editar</span>
                </button>
                <button class="action-btn delete-btn" onclick="deleteProduct(${product.id})" title="Eliminar producto">
                    <i class="bi bi-trash3"></i>
                    <span>Eliminar</span>
                </button>
            </div>
        </div>
    `).join('');
}

// Función para escapar HTML y evitar XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text ? text.replace(/[&<>"']/g, function(m) { return map[m]; }) : '';
}

// Función para editar producto
async function editProduct(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    // Cambiar al tab de modificar producto
    switchTab('edit-product');
    
    // Mostrar el formulario de edición
    const formContainer = document.getElementById('editProductFormContainer');
    const form = document.getElementById('editProductForm');
    
    form.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label for="editProductName">Nombre del Producto</label>
                <input type="text" id="editProductName" value="${escapeHtml(product.name)}" required>
            </div>
            <div class="form-group">
                <label for="editProductPrice">Precio</label>
                <input type="number" id="editProductPrice" step="0.01" value="${product.price}" required>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="editProductStock">Stock</label>
                <input type="number" id="editProductStock" value="${product.stock}" required>
            </div>
            <div class="form-group">
                <label for="editProductStatus">Estado</label>
                <select id="editProductStatus" required>
                    <option value="true" ${product.is_active ? 'selected' : ''}>Activo</option>
                    <option value="false" ${!product.is_active ? 'selected' : ''}>Inactivo</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <label for="editProductDescription">Descripción</label>
            <textarea id="editProductDescription" rows="3">${escapeHtml(product.description || '')}</textarea>
        </div>
        <div class="form-group">
            <label for="editProductImage">Imagen del Producto</label>
            <div class="file-input-container">
                <input type="file" id="editProductImage" accept="image/*" class="file-input">
                <label for="editProductImage" class="file-input-label">
                    <i class="bi bi-cloud-upload"></i>
                    <span class="file-text">Cambiar imagen</span>
                </label>
                ${product.image ? `
                    <div class="current-image">
                        <p>Imagen actual:</p>
                        <img src="${product.image}" alt="Imagen actual" style="max-width: 150px; border-radius: 0.5rem;">
                    </div>
                ` : ''}
                <div class="image-preview" id="editImagePreview" style="display: none;">
                    <img id="editPreviewImg" src="" alt="Vista previa">
                    <button type="button" class="remove-image" onclick="removeEditImage()">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="form-actions">
            <button type="submit" class="btn primary">
                <i class="bi bi-check"></i> Actualizar Producto
            </button>
            <button type="button" class="btn secondary" onclick="cancelEdit()">
                <i class="bi bi-x"></i> Cancelar
            </button>
        </div>
    `;
    
    formContainer.style.display = 'block';
    
    // Agregar event listener para el formulario
    form.onsubmit = (e) => handleEditProduct(e, productId);
    
    // Agregar event listener para la vista previa de imagen
    const editImageInput = document.getElementById('editProductImage');
    if (editImageInput) {
        editImageInput.addEventListener('change', handleEditImagePreview);
    }
}

// Función para eliminar producto
async function deleteProduct(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    if (confirm(`¿Estás seguro de que quieres eliminar "${product.name}"?`)) {
        try {
            const response = await authenticatedFetch(`http://localhost:3000/api/products/${productId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert('Producto eliminado correctamente');
                loadProducts(); // Recargar la lista
            } else {
                throw new Error('Error al eliminar el producto');
            }
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            alert(`Error al eliminar producto: ${error.message}`);
        }
    }
}

// Función para agregar producto
async function addProduct() {
    // Aquí puedes implementar un modal o formulario para agregar
    const name = prompt('Nombre del producto:');
    const description = prompt('Descripción del producto:');
    const price = prompt('Precio del producto:');
    const stock = prompt('Stock inicial:');
    const subcategoryId = prompt('ID de subcategoría:');
    
    if (name && price && stock && subcategoryId) {
        try {
            const response = await authenticatedFetch('http://localhost:3000/api/products', {
                method: 'POST',
                body: JSON.stringify({
                    name: name,
                    description: description || '',
                    price: parseFloat(price),
                    stock: parseInt(stock),
                    subcategory_id: parseInt(subcategoryId),
                    is_active: true
                })
            });
            
            if (response.ok) {
                alert('Producto creado correctamente');
                loadProducts(); // Recargar la lista
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear el producto');
            }
        } catch (error) {
            console.error('Error al crear producto:', error);
            alert(`Error al crear producto: ${error.message}`);
        }
    }
}

// Función para cerrar sesión
function logout() {
    // Limpiar datos de autenticación
    clearAuthData();
    // Redirigir al login
    window.location.href = '../login/login.html';
}

// Función para refrescar productos
function refreshProducts() {
    productsData = [];
    loadProducts();
}

// Función para inicializar formularios
function initializeForms() {
    // Formulario de agregar producto
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', handleAddProduct);
    }
    
    // Formulario de agregar usuario
    const addUserForm = document.getElementById('addUserForm');
    if (addUserForm) {
        addUserForm.addEventListener('submit', handleAddUser);
    }
    
    // Input de imagen
    const imageInput = document.getElementById('productImage');
    if (imageInput) {
        imageInput.addEventListener('change', handleImagePreview);
    }
}

// Manejar envío de formulario de producto
async function handleAddProduct(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        subcategory_id: parseInt(document.getElementById('productCategory').value),
        is_active: true
    };
    
    try {
        const response = await authenticatedFetch('http://localhost:3000/api/products', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            alert('Producto creado correctamente');
            e.target.reset();
            // Recargar productos si estamos en ese tab
            productsData = [];
            loadProducts();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al crear el producto');
        }
    } catch (error) {
        console.error('Error al crear producto:', error);
        alert(`Error al crear producto: ${error.message}`);
    }
}

// Manejar envío de formulario de usuario
async function handleAddUser(e) {
    e.preventDefault();
    
    const formData = {
        email: document.getElementById('userEmail').value,
        password: document.getElementById('userPassword').value
    };
    
    try {
        // Aquí harías la petición al endpoint de crear usuario admin
        console.log('Crear usuario:', formData);
        alert('Usuario creado correctamente (funcionalidad por implementar en backend)');
        e.target.reset();
    } catch (error) {
        console.error('Error al crear usuario:', error);
        alert(`Error al crear usuario: ${error.message}`);
    }
}

// Función para manejar vista previa de imagen
function handleImagePreview(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const fileText = document.querySelector('.file-text');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            preview.style.display = 'block';
            fileText.textContent = file.name;
        };
        reader.readAsDataURL(file);
    }
}

// Función para remover imagen
function removeImage() {
    const imageInput = document.getElementById('productImage');
    const preview = document.getElementById('imagePreview');
    const fileText = document.querySelector('.file-text');
    
    imageInput.value = '';
    preview.style.display = 'none';
    fileText.textContent = 'Seleccionar imagen';
}

// Actualizar texto del input de archivo cuando se selecciona
document.addEventListener('DOMContentLoaded', function() {
    const fileInputs = document.querySelectorAll('.file-input');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const label = this.nextElementSibling;
            const fileText = label.querySelector('.file-text');
            
            if (this.files && this.files[0]) {
                fileText.textContent = this.files[0].name;
            } else {
                fileText.textContent = 'Seleccionar imagen';
            }
        });
    });
});

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

// Función para manejar vista previa de imagen en edición
function handleEditImagePreview(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('editImagePreview');
    const previewImg = document.getElementById('editPreviewImg');
    const fileText = event.target.nextElementSibling.querySelector('.file-text');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            preview.style.display = 'block';
            fileText.textContent = file.name;
        };
        reader.readAsDataURL(file);
    }
}

// Función para remover imagen en edición
function removeEditImage() {
    const imageInput = document.getElementById('editProductImage');
    const preview = document.getElementById('editImagePreview');
    const fileText = document.querySelector('#editProductImage').nextElementSibling.querySelector('.file-text');
    
    imageInput.value = '';
    preview.style.display = 'none';
    fileText.textContent = 'Cambiar imagen';
}

// Función para cancelar edición
function cancelEdit() {
    const formContainer = document.getElementById('editProductFormContainer');
    formContainer.style.display = 'none';
    
    // Limpiar vista previa si existe
    const preview = document.getElementById('editImagePreview');
    if (preview) {
        preview.style.display = 'none';
    }
}

// Función para manejar la actualización del producto
async function handleEditProduct(e, productId) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('editProductName').value,
        description: document.getElementById('editProductDescription').value,
        price: parseFloat(document.getElementById('editProductPrice').value),
        stock: parseInt(document.getElementById('editProductStock').value),
        is_active: document.getElementById('editProductStatus').value === 'true'
    };
    
    // Aquí más adelante agregarás la lógica para la imagen
    const imageFile = document.getElementById('editProductImage').files[0];
    if (imageFile) {
        console.log('Nueva imagen seleccionada:', imageFile.name);
        // Aquí enviarías la imagen al backend
    }
    
    try {
        const response = await authenticatedFetch(`http://localhost:3000/api/products/${productId}`, {
            method: 'PUT',
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            alert('Producto actualizado correctamente');
            cancelEdit();
            // Recargar productos
            productsData = [];
            loadProducts();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al actualizar el producto');
        }
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        alert(`Error al actualizar producto: ${error.message}`);
    }
}