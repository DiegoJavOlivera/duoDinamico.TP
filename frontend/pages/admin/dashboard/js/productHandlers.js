// productHandlers.js - Manejo de productos en el frontend

// Variable global para almacenar los productos
let productsData = [];

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
                <button class="action-btn delete-btn" onclick="deleteProduct(${product.id})" title="Eliminar producto">
                    <i class="bi bi-trash3"></i>
                    <span>Eliminar</span>
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Manejar envío de formulario de agregar producto
 * @param {Event} e - Evento de submit
 */
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
        await createProduct(formData);
        alert('Producto creado correctamente');
        e.target.reset();
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
        <div class="form-row">
            <div class="form-group">
                <label for="editProductCategory">Categoría</label>
                <input type="text" id="editProductCategory" value="${product.Subcategory?.Category?.name || 'Sin categoría'}" readonly>
            </div>
            <div class="form-group">
                <label for="editProductSubcategory">Subcategoría</label>
                <input type="text" id="editProductSubcategory" value="${product.Subcategory?.name || 'Sin subcategoría'}" readonly>
                <input type="hidden" id="editProductSubcategoryId" value="${product.subcategory_id}">
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

/**
 * Función para manejar la actualización del producto
 * @param {Event} e - Evento de submit
 * @param {number} productId - ID del producto
 */
async function handleEditProduct(e, productId) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('editProductName').value,
        description: document.getElementById('editProductDescription').value,
        price: parseFloat(document.getElementById('editProductPrice').value),
        stock: parseInt(document.getElementById('editProductStock').value),
        subcategory_id: parseInt(document.getElementById('editProductSubcategoryId').value),
        is_active: document.getElementById('editProductStatus').value === 'true'
    };
    
    // Aquí más adelante agregarás la lógica para la imagen
    const imageFile = document.getElementById('editProductImage').files[0];
    if (imageFile) {
        console.log('Nueva imagen seleccionada:', imageFile.name);
        // Aquí enviarías la imagen al backend
    }
    
    try {
        await updateProduct(productId, formData);
        alert('Producto actualizado correctamente');
        cancelEdit();
        // Recargar productos
        productsData = [];
        loadProducts();
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        alert(`Error al actualizar producto: ${error.message}`);
    }
}

/**
 * Función para eliminar producto
 * @param {number} productId - ID del producto
 */
async function deleteProduct(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    if (confirm(`¿Estás seguro de que quieres eliminar "${product.name}"?`)) {
        try {
            await deleteProductById(productId);
            alert('Producto eliminado correctamente');
            loadProducts(); // Recargar la lista
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
