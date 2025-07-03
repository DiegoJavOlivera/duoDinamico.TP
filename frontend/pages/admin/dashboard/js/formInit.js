// formInit.js - Inicialización y manejo de formularios

/**
 * Función para inicializar formularios
 */
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

/**
 * Manejar envío de formulario de usuario
 * @param {Event} e - Evento de submit
 */
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
