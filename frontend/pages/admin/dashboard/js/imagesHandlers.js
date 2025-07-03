// imagesHandlers.js - Manejo de imágenes de productos

/**
 * Función para manejar vista previa de imagen
 * @param {Event} event - Evento de cambio del input file
 */
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

/**
 * Función para remover imagen
 */
function removeImage() {
    const imageInput = document.getElementById('productImage');
    const preview = document.getElementById('imagePreview');
    const fileText = document.querySelector('.file-text');
    
    imageInput.value = '';
    preview.style.display = 'none';
    fileText.textContent = 'Seleccionar imagen';
}

/**
 * Función para manejar vista previa de imagen en edición
 * @param {Event} event - Evento de cambio del input file
 */
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

/**
 * Función para remover imagen en edición
 */
function removeEditImage() {
    const imageInput = document.getElementById('editProductImage');
    const preview = document.getElementById('editImagePreview');
    const fileText = document.querySelector('#editProductImage').nextElementSibling.querySelector('.file-text');
    
    imageInput.value = '';
    preview.style.display = 'none';
    fileText.textContent = 'Cambiar imagen';
}

/**
 * Inicializar event listeners para inputs de archivos
 */
function initializeFileInputs() {
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
}
