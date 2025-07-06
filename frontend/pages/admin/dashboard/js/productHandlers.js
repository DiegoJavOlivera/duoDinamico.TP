// productHandlers.js - Manejo de productos en el frontend

// Variable global para almacenar los productos
let productsData = [];

// Variable global para almacenar las subcategorías (incluye información de categorías)
let subcategoriesData = [];

// Función de respaldo para getImageUrl si no está disponible
function getImageUrl(imageName) {
    if (!imageName) return null;
    
    // Si la imagen incluye "backend/uploads/img/", remover "backend/" para el frontend
    if (imageName.startsWith('backend/uploads/img/')) {
        const imagePath = imageName.replace('backend/', '');
        return `http://localhost:3000/${imagePath}`;
    }
    
    // Si la imagen ya incluye la ruta completa (como "uploads/img/nombre.png"), usar directamente
    if (imageName.startsWith('uploads/')) {
        return `http://localhost:3000/${imageName}`;
    }
    
    // Si es solo el nombre del archivo, agregar la ruta uploads/img
    return `http://localhost:3000/uploads/img/${imageName}`;
}

/**
 * Función para cargar subcategorías desde la API (se ejecuta una vez)
 */
async function loadSubcategoriesData() {
    if (subcategoriesData.length === 0) {
        try {
            subcategoriesData = await getAllSubcategories();
        } catch (error) {
            console.error('Error al cargar datos de subcategorías:', error);
            subcategoriesData = [];
        }
    }
    return subcategoriesData;
}

/**
 * Función para escapar HTML y evitar XSS
 * @param {string} text - Texto a escapar
 * @returns {string} Texto escapado
 */
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

/**
 * Cargar productos desde la API
 */
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
        
        const products = await getProducts();
        console.log(products)
        productsData = products;
        
        console.log('Productos cargados:', products.length);
        
        // Ocultar loading
        loadingElement.style.display = 'none';
        
        // Mostrar productos
        renderProducts(products);
        
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

/**
 * Renderizar productos en el grid
 * @param {Array} products - Lista de productos
 */
function renderProducts(products) {
    const gridElement = document.getElementById('products-grid');
    
    if (!products || products.length === 0) {
        gridElement.innerHTML = `
            <div class="coming-soon" style="grid-column: 1 / -1;">
                No hay productos disponibles
            </div>
        `;
        return;
    }
    
    gridElement.innerHTML = products.map(product => {
        const imageUrl = getImageUrl(product.image);
        
        return `
        <div class="product-card">
            <div class="card-main">
                <div class="product-image-section">
                    <div class="product-image ${!imageUrl ? 'no-image' : ''}">
                        ${imageUrl ? `
                            <img src="${imageUrl}" alt="${escapeHtml(product.name)}" onerror="this.parentElement.classList.add('no-image'); this.style.display='none';">
                        ` : `
                            <i class="bi bi-image"></i>
                        `}
                        <div class="product-status-overlay ${product.is_active ? 'active' : 'inactive'}">
                            ${product.is_active ? 'ACTIVE' : 'INACTIVE'}
                        </div>
                    </div>
                </div>
                
                <div class="product-details-section">
                    <div class="product-header">
                        <div class="product-title-area">
                            <h3 class="product-title">${escapeHtml(product.name)}</h3>
                            <p class="product-description">${escapeHtml(product.description || 'Sin descripción disponible')}</p>
                        </div>
                        <div class="product-price-container">
                            <div class="product-price">$${parseFloat(product.price).toFixed(2)}</div>
                        </div>
                    </div>
                    
                    <div class="product-info-section">
                        <div class="info-row">
                            <div class="info-item stock-info">
                                <span class="info-icon"><i class="bi bi-box"></i></span>
                                <span class="info-text">
                                    <span class="info-label">Stock</span>
                                    <span class="info-value">${product.stock} unidades</span>
                                </span>
                            </div>
                        </div>
                        
                        <div class="info-row category-info">
                            <div class="info-item">
                                <span class="info-icon"><i class="bi bi-tag"></i></span>
                                <span class="info-text">
                                    <span class="info-label">Categoría</span>
                                    <span class="info-value">${product.Subcategory?.Category?.name || 'Sin categoría'}</span>
                                </span>
                            </div>
                        </div>
                        
                        <div class="info-row subcategory-info">
                            <div class="info-item">
                                <span class="info-icon"><i class="bi bi-tags"></i></span>
                                <span class="info-text">
                                    <span class="info-label">Subcategoría</span>
                                    <span class="info-value">${product.Subcategory?.name || 'Sin subcategoría'}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="product-actions">
                <button class="action-btn edit-btn" onclick="editProduct(${product.id})" title="Editar producto">
                    <i class="bi bi-pencil-square"></i>
                    <span>Editar</span>
                </button>
                <button class="action-btn delete-btn ${product.is_active ? 'active' : 'inactive'}" onclick="deleteProduct(${product.id})" title="${product.is_active ? 'Eliminar producto' : 'Reactivar producto'}">
                    <i class="bi ${product.is_active ? 'bi-trash3' : 'bi-arrow-clockwise'}"></i>
                    <span>${product.is_active ? 'Eliminar' : 'Reactivar'}</span>
                </button>
            </div>
        </div>
        `;
    }).join('');
}

/**
 * Manejar envío de formulario de agregar producto
 * @param {Event} e - Evento de submit
 */
async function handleAddProduct(e) {
    e.preventDefault();
    
    // Obtener todos los valores del formulario
    const name = document.getElementById('productName').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    const price = document.getElementById('productPrice').value;
    const stock = document.getElementById('productStock').value;
    const subcategoryId = document.getElementById('productSubcategory').value;
    const imageFile = document.getElementById('productImage').files[0];
    
    // Validaciones básicas
    if (!name || !price || !stock || !subcategoryId) {
        alert('Por favor completa todos los campos obligatorios');
        return;
    }
    
    if (!imageFile) {
        alert('Por favor selecciona una imagen para el producto');
        return;
    }
    
    // Validar tipos de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(imageFile.type)) {
        alert('Por favor selecciona una imagen válida (JPG, PNG o WebP)');
        return;
    }
    
    // Validar tamaño del archivo (max 5MB)
    if (imageFile.size > 5 * 1024 * 1024) {
        alert('La imagen no puede superar los 5MB');
        return;
    }
    
    // Crear FormData para enviar archivos
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('subcategory_id', subcategoryId);
    formData.append('image', imageFile);
    
    try {
        await createProduct(formData);
        alert('Producto creado correctamente');
        e.target.reset();
        
        // Resetear también el select de subcategorías
        const subcategorySelect = document.getElementById('productSubcategory');
        if (subcategorySelect) {
            subcategorySelect.innerHTML = '<option value="">Primero selecciona una categoría</option>';
            subcategorySelect.disabled = true;
        }
        
        // Limpiar vista previa de imagen si existe
        const imagePreview = document.getElementById('imagePreview');
        if (imagePreview) {
            imagePreview.style.display = 'none';
        }
        
        // Resetear el texto del input de archivo
        const fileText = document.querySelector('.file-text');
        if (fileText) {
            fileText.textContent = 'Seleccionar imagen';
        }
        
        // Recargar productos
        productsData = [];
        loadProducts();
    } catch (error) {
        console.error('Error al crear producto:', error);
        alert(`Error al crear producto: ${error.message}`);
    }
}

/**
 * Función para editar producto
 * @param {number} productId - ID del producto
 */
async function editProduct(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    // Cambiar al tab de modificar producto
    switchTab('edit-product');
    
    // Mostrar el formulario de edición
    const formContainer = document.getElementById('editProductFormContainer');
    const form = document.getElementById('editProductForm');
    
    try {
        // Cargar categorías y subcategorías
        const categories = await getCategories();
        const allSubcategories = await loadSubcategoriesData();
        
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
                    <label for="editProductCategory">Categoría</label>
                    <select id="editProductCategory" required onchange="loadSubcategoriesForEdit()">
                        <option value="">Seleccionar categoría</option>
                        ${categories.map(category => `
                            <option value="${category.id}" ${product.Subcategory?.Category?.id === category.id ? 'selected' : ''}>
                                ${category.name}
                            </option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="editProductSubcategory">Subcategoría</label>
                    <select id="editProductSubcategory" required>
                        <option value="">Seleccionar subcategoría</option>
                        ${allSubcategories
                            .filter(sub => sub.category_id === product.Subcategory?.Category?.id)
                            .map(subcategory => `
                                <option value="${subcategory.id}" ${product.subcategory_id === subcategory.id ? 'selected' : ''}>
                                    ${subcategory.name}
                                </option>
                            `).join('')}
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label for="editProductDescription">Descripción</label>
                <textarea id="editProductDescription" rows="3">${escapeHtml(product.description || '')}</textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="editProductStock">Stock</label>
                    <input type="number" id="editProductStock" value="${product.stock}" required>
                </div>
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
                            <img src="${getImageUrl(product.image)}" alt="Imagen actual" style="max-width: 150px; border-radius: 0.5rem;">
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
        
    } catch (error) {
        console.error('Error al cargar categorías y subcategorías:', error);
        alert('Error al cargar la información de categorías. Inténtalo de nuevo.');
    }
}

/**
 * Función para manejar la actualización del producto
 * @param {Event} e - Evento de submit
 * @param {number} productId - ID del producto
 */
async function handleEditProduct(e, productId) {
    e.preventDefault();
    const imageFile = document.getElementById('editProductImage').files[0];
    
    // Si hay imagen nueva, usar FormData; si no, usar objeto normal
    if (imageFile) {
        // Validar tipos de archivo
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(imageFile.type)) {
            alert('Por favor selecciona una imagen válida (JPG, PNG o WebP)');
            return;
        }
        
        // Validar tamaño del archivo (max 5MB)
        if (imageFile.size > 5 * 1024 * 1024) {
            alert('La imagen no puede superar los 5MB');
            return;
        }
        
        // Crear FormData cuando hay imagen
        const formData = new FormData();
        formData.append('name', document.getElementById('editProductName').value);
        formData.append('description', document.getElementById('editProductDescription').value);
        formData.append('price', document.getElementById('editProductPrice').value);
        formData.append('stock', document.getElementById('editProductStock').value);
        formData.append('subcategory_id', document.getElementById('editProductSubcategory').value);
        formData.append('image', imageFile);
        
        try {
            await updateProduct(productId, formData);
            alert('Producto actualizado correctamente');
            cancelEdit();
            productsData = [];
            loadProducts();
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            alert(`Error al actualizar producto: ${error.message}`);
        }
    } else {
        // Sin imagen, usar objeto normal
        const productData = {
            name: document.getElementById('editProductName').value,
            description: document.getElementById('editProductDescription').value,
            price: parseFloat(document.getElementById('editProductPrice').value),
            stock: parseInt(document.getElementById('editProductStock').value),
            subcategory_id: parseInt(document.getElementById('editProductSubcategory').value),

        };
        
        try {
            await updateProduct(productId, productData);
            alert('Producto actualizado correctamente');
            cancelEdit();
            productsData = [];
            loadProducts();
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            alert(`Error al actualizar producto: ${error.message}`);
        }
    }
}

/**
 * Función para eliminar producto
 * @param {number} productId - ID del producto
 */
async function deleteProduct(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    if (confirm(`¿Estás seguro de que quieres ${product.is_active? "eliminar": "reactivar"} "${product.name}"?`)) {
        try {
            await deleteProductById(productId);
            alert(`Producto ${product.name} ${product.is_active? "eliminado": "reactivado"}`);
            loadProducts();
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            alert(`Error al eliminar producto: ${error.message}`);
        }
    }
}

/**
 * Función para cancelar edición
 */
function cancelEdit() {
    const formContainer = document.getElementById('editProductFormContainer');
    formContainer.style.display = 'none';
    
    // Limpiar vista previa si existe
    const preview = document.getElementById('editImagePreview');
    if (preview) {
        preview.style.display = 'none';
    }
}

/**
 * Función para refrescar productos
 */
function refreshProducts() {
    productsData = [];
    loadProducts();
}

/**
 * Función para cargar subcategorías cuando se selecciona una categoría en el formulario de agregar
 */
async function loadSubcategoriesForForm() {
    const categorySelect = document.getElementById('productCategory');
    const subcategorySelect = document.getElementById('productSubcategory');
    
    if (!categorySelect || !subcategorySelect) return;
    
    const categoryId = parseInt(categorySelect.value);
    
    if (!categoryId) {
        subcategorySelect.innerHTML = '<option value="">Primero selecciona una categoría</option>';
        subcategorySelect.disabled = true;
        return;
    }
    
    try {
        subcategorySelect.innerHTML = '<option value="">Cargando...</option>';
        subcategorySelect.disabled = true;
        
        // Cargar datos de subcategorías si no están cargados
        const allSubcategories = await loadSubcategoriesData();
        
        // Filtrar subcategorías por categoría seleccionada
        const subcategories = allSubcategories.filter(sub => sub.category_id === categoryId);
        
        subcategorySelect.innerHTML = '<option value="">Seleccionar subcategoría</option>';
        subcategories.forEach(subcategory => {
            const option = document.createElement('option');
            option.value = subcategory.id;
            option.textContent = subcategory.name;
            subcategorySelect.appendChild(option);
        });
        
        subcategorySelect.disabled = false;
        
    } catch (error) {
        console.error('Error al cargar subcategorías:', error);
        subcategorySelect.innerHTML = '<option value="">Error al cargar subcategorías</option>';
        subcategorySelect.disabled = true;
    }
}

/**
 * Función para cargar subcategorías cuando se selecciona una categoría en el formulario de editar
 */
async function loadSubcategoriesForEdit() {
    const categorySelect = document.getElementById('editProductCategory');
    const subcategorySelect = document.getElementById('editProductSubcategory');
    
    if (!categorySelect || !subcategorySelect) return;
    
    const categoryId = parseInt(categorySelect.value);
    
    if (!categoryId) {
        subcategorySelect.innerHTML = '<option value="">Primero selecciona una categoría</option>';
        subcategorySelect.disabled = true;
        return;
    }
    
    try {
        subcategorySelect.innerHTML = '<option value="">Cargando...</option>';
        subcategorySelect.disabled = true;
        
        // Cargar datos de subcategorías si no están cargados
        const allSubcategories = await loadSubcategoriesData();
        
        // Filtrar subcategorías por categoría seleccionada
        const subcategories = allSubcategories.filter(sub => sub.category_id === categoryId);
        
        subcategorySelect.innerHTML = '<option value="">Seleccionar subcategoría</option>';
        subcategories.forEach(subcategory => {
            const option = document.createElement('option');
            option.value = subcategory.id;
            option.textContent = subcategory.name;
            subcategorySelect.appendChild(option);
        });
        
        subcategorySelect.disabled = false;
        
    } catch (error) {
        console.error('Error al cargar subcategorías:', error);
        subcategorySelect.innerHTML = '<option value="">Error al cargar subcategorías</option>';
        subcategorySelect.disabled = true;
    }
}


// Variable global para almacenar los movimientos
let movementsData = [];

/**
 * Cargar movimientos desde la API
 */
async function loadMovements() {
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
        console.log('URL de la API:', `${API_BASE_URL || 'http://localhost:3000/api'}/admin/actions?page=1`);
        
        // Primero intentar con una sola página para debuggear
        const response = await getMovements(1);
        console.log('Respuesta de la API:', response);
        
        const movements = response.data || [];
        movementsData = movements;
        
        console.log('Movimientos cargados:', movements.length);
        if (movements.length > 0) {
            console.log('Estructura del primer movimiento:', movements[0]);
        }
        
        // Ocultar loading
        loadingElement.style.display = 'none';
        
        // Mostrar movimientos
        renderMovements(movements);
        
    } catch (error) {
        console.error('Error detallado al cargar movimientos:', error);
        console.error('Stack trace:', error.stack);
        
        // Ocultar loading
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        
        if (listElement) {
            listElement.innerHTML = `
                <div style="background: #2a1a1a; padding: 1.5rem; border-radius: 0.5rem; border: 1px solid #ff4444; color: #ff6666; text-align: center;">
                    <i class="bi bi-exclamation-triangle" style="font-size: 1.5rem; margin-bottom: 0.5rem; display: block;"></i> 
                    <strong>Error al cargar movimientos:</strong><br>
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

/**
 * Renderizar movimientos en el dashboard
 * @param {Array} movements - Lista de movimientos
 */
function renderMovements(movements) {
    const listElement = document.getElementById('movementsList');
    
    if (!movements || movements.length === 0) {
        listElement.innerHTML = `
            <div class="coming-soon" style="grid-column: 1 / -1;">
                No hay movimientos disponibles
            </div>
        `;
        return;
    }
    
    console.log('Renderizando movimientos en cards:', movements.length);
    
    // Crear un grid de cards usando las clases CSS
    listElement.innerHTML = `
        <div class="movements-grid">
            ${movements.map(movement => {
                const date = new Date(movement.created_at).toLocaleString('es-ES', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                // Determinar el icono y clase CSS según el tipo de acción
                let actionIcon = 'bi-info-circle';
                let actionClass = 'default';
                
                if (movement.Action.name.toLowerCase().includes('crear')) {
                    actionIcon = 'bi-plus-circle';
                    actionClass = 'create';
                } else if (movement.Action.name.toLowerCase().includes('actualizar') || movement.Action.name.toLowerCase().includes('modificar')) {
                    actionIcon = 'bi-pencil-square';
                    actionClass = 'update';
                } else if (movement.Action.name.toLowerCase().includes('eliminar') || movement.Action.name.toLowerCase().includes('inactive')) {
                    actionIcon = 'bi-trash3';
                    actionClass = 'delete';
                } else if (movement.Action.name.toLowerCase().includes('active')) {
                    actionIcon = 'bi-arrow-clockwise';
                    actionClass = 'activate';
                }
                
                return `
                    <div class="movement-card">
                        <div class="movement-content">
                            <!-- Icono de acción -->
                            <div class="movement-icon-container">
                                <div class="movement-icon ${actionClass}">
                                    <i class="bi ${actionIcon}"></i>
                                </div>
                            </div>
                            
                            <!-- Información del movimiento -->
                            <div class="movement-info">
                                <div class="movement-header">
                                    <div class="movement-title-area">
                                        <h3 class="movement-title">
                                            ${escapeHtml(movement.Action.name)}
                                        </h3>
                                        ${movement.Product ? `
                                            <p class="movement-description">
                                                Producto: ${escapeHtml(movement.Product.name)}
                                            </p>
                                        ` : `
                                            <p class="movement-description general">
                                                Acción general del sistema
                                            </p>
                                        `}
                                    </div>
                                    <div class="movement-id-area">
                                        <div class="movement-id">
                                            ID: ${movement.id}
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="movement-details">
                                    <!-- Primera fila: Fecha -->
                                    <div class="movement-details-row">
                                        <div class="movement-info-box">
                                            <i class="bi bi-calendar-event movement-info-icon"></i>
                                            <div class="movement-info-content">
                                                <span class="movement-info-label">Fecha</span>
                                                <span class="movement-info-value">${date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Segunda fila: Usuario y Producto -->
                                    <div class="movement-details-row">
                                        <div class="movement-info-box">
                                            <i class="bi bi-person-check movement-info-icon"></i>
                                            <div class="movement-info-content">
                                                <span class="movement-info-label">Usuario Responsable</span>
                                                <span class="movement-info-value">${escapeHtml(movement.User.name)}</span>
                                            </div>
                                        </div>
                                        
                                        ${movement.Product ? `
                                            <div class="movement-info-box movement-product-info">
                                                <i class="bi bi-box movement-info-icon"></i>
                                                <div class="movement-info-content">
                                                    <span class="movement-info-label">Producto</span>
                                                    <div class="movement-product-name">${escapeHtml(movement.Product.name)}</div>
                                                    <div class="movement-product-id">ID: #${movement.Product.id}</div>
                                                </div>
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

/**
 * Función para refrescar movimientos
 */
function refreshMovements() {
    movementsData = [];
    loadMovements();
}

// Hacer las funciones de movimientos disponibles globalmente
window.loadMovements = loadMovements;
window.refreshMovements = refreshMovements;

// Hacer las funciones disponibles globalmente
window.loadSubcategoriesForForm = loadSubcategoriesForForm;
window.loadSubcategoriesForEdit = loadSubcategoriesForEdit;
window.loadSubcategoriesData = loadSubcategoriesData;
