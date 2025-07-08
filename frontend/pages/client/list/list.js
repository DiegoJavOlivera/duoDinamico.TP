const USERNAME = localStorage.getItem('userName');
const THEME = localStorage.getItem('theme');

// Navegación por steps
let step = 1; // 1: categorías, 2: subcategorías, 3: productos
let currentCategory = null;
let currentSubcategory = null;
let lastSubcategories = [];

document.addEventListener('DOMContentLoaded', async () => {
    if (!USERNAME) {
        alert('Debe colocar su nombre para acceder a la lista de productos');
        window.location.href = '../../../index.html';
    }
    document.querySelector('.user-name').textContent = USERNAME;
    // Función para inicializar vista
    renderStep();

    // Función para actualizar el badge del carrito
    updateCartBadge();
    
    await renderCategories();
});

// Función para renderizar categorías
/**
 * Renderiza las tarjetas de categorías en la vista principal.
 * Obtiene las categorías desde la API y las muestra dinámicamente.
 * Muestra un mensaje de error si no se pueden cargar.
 */
async function renderCategories() {
    const categoriesContainer = document.getElementById('categories-cards');
    categoriesContainer.innerHTML = '';

    try {
        const categories = await getCategories();
        categories.forEach(category => {
            const col = document.createElement('div');
            // Columna de categorías responsive
            col.className = 'col-12 col-md-6 col-lg-5 d-lg-flex';
            col.innerHTML = `
                <div class="card text-light shadow-sm text-center flex-fill w-100 mb-4 h-100">
                    <img src="http://localhost:3000/${category.image}" alt="${category.name}" class="card-img-top img-fluid rounded-top">
                    <div class="card-body d-flex flex-column justify-content-between">
                        <div>
                            <h5 class="card-title fs-5 fw-bold">${category.name}</h5>
                            <p class="card-text small">${category.description}</p>
                        </div>
                        <button class="btn btn-primary mt-3 w-100" data-category-id="${category.id}">
                            Explorar ${category.name}
                            <i class="bi bi-arrow-right"></i>
                        </button>
                    </div>
                </div>
            `;
            col.querySelector('button').onclick = () => selectCategory(category);
            categoriesContainer.appendChild(col);
        });
    } catch (err) {
        categoriesContainer.innerHTML = '<div class="text-danger">No se pudieron cargar las categorías.</div>';
    }
}

// Función para moverse al carrito
/**
 * Redirige al usuario a la página del carrito de compras.
 */
function moveToCart() {
    window.location.href = '../../../pages/client/cart/cart.html';
}

// Función para actualizar el badge del carrito
/**
 * Actualiza el badge (contador) del carrito en la interfaz.
 * Muestra el número de productos y cambia el estilo si hay productos.
 */
function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    const count = getCartCount();
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-block' : 'none';
      badge.classList.toggle('bg-warning', count > 0);
      badge.classList.toggle('text-dark', count > 0);
    }
}

// Función para renderizar subcategorías
/**
 * Renderiza las tarjetas de subcategorías para una categoría seleccionada.
 *
 * @param {Array} subcategories - Lista de subcategorías a mostrar.
 * @param {string} category_name - Nombre de la categoría seleccionada.
 */
function renderSubcategories(subcategories, category_name) {
    const container = document.querySelector('.sub-cards-container');
    const title = document.getElementById('subcategory-title');
    title.textContent = category_name;

    container.innerHTML = '';

    subcategories.forEach(subcat => {
        const card = document.createElement('div');
        card.innerHTML = `
            <div class="subcard">
                <div class="subcard-img-wrap">
                    <img src="http://localhost:3000/${subcat.image}" alt="${subcat.name}">
                </div>
                <div class="subcard-body">
                    <h5 class="subcard-title fs-5 fw-bold">${subcat.name}</h5>
                    <p class="subcard-text">${subcat.description}</p>
                    <button class="subbtn btn btn-primary mx-auto w-50" data-subcategory-id="${subcat.id}">
                        Ver productos
                    <i class="bi bi-arrow-right"></i>
                </button>
                </div>
            </div>
        `;

        card.querySelector('.subbtn').onclick = () => selectSubcategory(subcat);
        container.appendChild(card);
    });
}


/**
 * Controla la navegación por pasos (categorías, subcategorías, productos).
 * Muestra u oculta los contenedores según el paso actual y renderiza el contenido correspondiente.
 */
async function renderStep() {
    // Ocultar todo
    document.querySelector('.categories-container').classList.add('isHidden');
    document.querySelector('.subcategories-container').classList.add('isHidden');
    document.querySelector('.products-container').classList.add('isHidden');
    document.getElementById('back-to-categories').classList.add('isHidden');
    document.getElementById('back-to-subcategories').classList.add('isHidden');

    if (step === 1) {
        document.querySelector('.categories-container').classList.remove('isHidden');
    } else if (step === 2) {
        document.querySelector('.subcategories-container').classList.remove('isHidden');
        document.getElementById('back-to-categories').classList.remove('isHidden');

        // Render subcategorías
        const subcategories = await getSubcategoryByCategoryId(currentCategory.id);
        lastSubcategories = subcategories;

        renderSubcategories(subcategories, currentCategory.name);
    } else if (step === 3) {
        document.querySelector('.products-container').classList.remove('isHidden');
        document.getElementById('back-to-subcategories').classList.remove('isHidden');

        // Render productos
        const products = await getProducts({subcategory: currentSubcategory.id, all: false});
        renderProducts(products, currentSubcategory.name);
    }
}

// Función para seleccionar categoría
/**
 * Selecciona una categoría y avanza al paso de subcategorías.
 *
 * @param {Object} category - Categoría seleccionada.
 */
window.selectCategory = (category) => {
    currentCategory = category;
    step = 2;
    renderStep();
};

// Función para seleccionar subcategoría
/**
 * Selecciona una subcategoría y avanza al paso de productos.
 *
 * @param {Object} subcategory - Subcategoría seleccionada.
 */
window.selectSubcategory = (subcategory) => {
    currentSubcategory = subcategory;
    step = 3;
    renderStep();
};

// Función para volver a categorías
/**
 * Vuelve al paso de categorías y limpia las subcategorías mostradas.
 */
document.getElementById('back-to-categories').onclick = () => {
    step = 1;
    renderStep();
    // Limpiar subcategorías
    document.querySelector('.sub-cards-container').innerHTML = '';
};

// Función para volver a subcategorías
/**
 * Vuelve al paso de subcategorías y limpia los productos mostrados.
 */
document.getElementById('back-to-subcategories').onclick = () => {
    step = 2;
    renderStep();
    // Limpiar productos
    document.querySelector('.product-cards-container').innerHTML = '';
};


// Lógica botón Cancelar Compra
/**
 * Cancela la compra, limpia el localStorage y redirige al inicio.
 */
const cancel = () => {
    localStorage.clear();
    window.location.href = '../../../index.html';
}


// Render product cards
/**
 * Renderiza las tarjetas de productos para una subcategoría seleccionada.
 * Muestra los botones para agregar, sumar/restar cantidad y el estado de stock.
 *
 * @param {Array} products - Lista de productos a mostrar.
 * @param {string} subcategory_name - Nombre de la subcategoría seleccionada.
 */
function renderProducts(products, subcategory_name) {
    const container = document.querySelector('.product-cards-container');
    const noProducts = document.querySelector('.no-products');
    const title = document.getElementById('product-title');
    const selectText = document.querySelector('.select-product');
    title.textContent = subcategory_name;

    container.innerHTML = '';
    noProducts.textContent = '';

    if (!products || products.length === 0) {
        noProducts.textContent = 'No hay productos disponibles para esta subcategoría';
        selectText.classList.add('isHidden');
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-stock', product.stock);

        const cart = getCart();
        const cartItem = cart?.products?.find(item => item.id === product.id);
        const cantidad = cartItem ? cartItem.quantity : 0;
        const subtotal = cantidad * product.price;

        card.innerHTML = `
            <img class="product-img" src="http://localhost:3000/${product.image}" alt="${product.name}">
            <div class="product-name text-align-left">${product.name}</div>
            <div class="product-desc text-align-left">${product.description}</div>
            <div class="product-price text-align-left">$${product.price}</div>
            <div class="product-btn-container"></div>
        `;

        const btnContainer = card.querySelector('.product-btn-container');
        if (product.stock === 0) {
            btnContainer.innerHTML = `<div class="no-stock-msg">Agotado</div>`;
            card.classList.add('no-stock');
            container.appendChild(card);
            return;
        }

        let cartObj = getCart();
        if (!cartObj || !Array.isArray(cartObj.products)) {
            cartObj = { products: [] };
        }
        const prodInCart = cartObj.products.find(p => p.id === product.id);

        if (prodInCart) {
            btnContainer.innerHTML = `
                <div class="d-flex justify-content-between align-items-center w-100">
                    <div class="d-flex gap-4 align-items-center">
                        <button class="btn fs-5 fw-bold btn-restar">-</button>
                        <span class="cantidad-en-carrito fs-5 fw-bold">${prodInCart.quantity}</span>
                        <button class="btn btn-success fs-5 fw-bold btn-sumar">+</button>
                    </div>
                    <div class="product-subtotal fs-5 ms-3">$${subtotal}</div>
                </div>
            `;
            const btnSumar = btnContainer.querySelector('.btn-sumar');
            const btnRestar = btnContainer.querySelector('.btn-restar');

            btnSumar.addEventListener('click', () => {
                const currentQty = prodInCart.quantity;
                const stock = Number(card.getAttribute('data-stock'));
                if (currentQty >= stock) {
                    alert('No hay más stock disponible para este producto');
                    return;
                }
                addToCart(product);
                renderProducts(products, subcategory_name);
                updateCartBadge();
            });
            btnRestar.addEventListener('click', () => {
                let cartObj = getCart();
                const idx = cartObj.products.findIndex(p => p.id === product.id);
                if (idx > -1) {
                    if (cartObj.products[idx].quantity > 1) {
                        cartObj.products[idx].quantity -= 1;
                    } else {
                        cartObj.products.splice(idx, 1);
                    }
                    setCart(cartObj);
                }
                renderProducts(products, subcategory_name);
                updateCartBadge();
            });
        } else {
            // Si no está en el carrito, muestra solo el botón agregar
            btnContainer.innerHTML = `
                <button class="btn text-light product-btn">
                    <i class="bi bi-cart me-2"></i>
                    Agregar al carrito
                </button>
            `;
            const btn = btnContainer.querySelector('.product-btn');
            btn.addEventListener('click', () => {
                // Validar stock antes de agregar
                let cartObj = getCart();
                if (!cartObj || !Array.isArray(cartObj.products)) cartObj = { products: [] };
                const prodInCart = cartObj.products.find(p => p.id === product.id);
                const currentQty = prodInCart ? prodInCart.quantity : 0;
                const stock = Number(card.getAttribute('data-stock'));

                if (currentQty >= stock) {
                    alert('No hay más stock disponible para este producto');
                    return;
                }
                addToCart(product);
                renderProducts(products, subcategory_name);
                updateCartBadge();
            });
        }
        container.appendChild(card);
    });
}

