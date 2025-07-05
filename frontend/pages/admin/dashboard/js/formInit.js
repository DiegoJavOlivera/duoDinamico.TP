// formInit.js - Inicialización y manejo de formularios

/**
 * Función para inicializar formularios
 */
async function initializeForms() {
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
    
    // Precargar datos de subcategorías para optimizar el rendimiento
    if (typeof loadSubcategoriesData === 'function') {
        loadSubcategoriesData();
    }
    
    // Cargar categorías dinámicamente
    await loadCategoriesForAddForm();
}

/**
 * Función para cargar categorías en el formulario de agregar producto
 */
async function loadCategoriesForAddForm() {
    const categorySelect = document.getElementById('productCategory');
    if (!categorySelect) return;
    
    try {
        const categories = await getCategories();
        
        // Limpiar opciones existentes excepto la primera
        categorySelect.innerHTML = '<option value="">Seleccionar categoría</option>';
        
        // Agregar las categorías obtenidas de la API
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
        
    } catch (error) {
        console.error('Error al cargar categorías:', error);
        // Mantener una opción de error
        categorySelect.innerHTML = `
            <option value="">Error al cargar categorías</option>
        `;
    }
}

/**
 * Manejar envío de formulario de usuario
 * @param {Event} e - Evento de submit
 */
async function handleAddUser(e) {
    e.preventDefault();
    
    // Obtener todos los valores del formulario
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const password = document.getElementById('userPassword').value;
    const roleId = document.getElementById('userRole').value;
    
    // Validaciones básicas
    if (!name || !email || !password || !roleId) {
        alert('Por favor completa todos los campos obligatorios');
        return;
    }
    
    if (password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    // Preparar datos según la estructura requerida
    const userData = {
        name: name,
        email: email,
        password: password,
        role_id: parseInt(roleId)
    };
    
    try {
        console.log('Enviando datos de usuario:', userData);
        
        // Usar authenticatedFetch para hacer la petición
        const response = await authenticatedFetch('http://localhost:3000/api/admin/users/', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al crear usuario');
        }
        
        const result = await response.json();
        console.log('Usuario creado exitosamente:', result);
        
        alert('Usuario creado correctamente');
        e.target.reset();
        
    } catch (error) {
        console.error('Error al crear usuario:', error);
        alert(`Error al crear usuario: ${error.message}`);
    }
}

// Hacer funciones disponibles globalmente
window.loadCategoriesForAddForm = loadCategoriesForAddForm;
