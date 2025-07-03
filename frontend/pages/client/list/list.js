const categories = {
    drink: {
        id: 1,
        name: "Bebidas"
    },
    accessories: {
        id: 2,
        name: "Accesorios"
    }
};

const USERNAME = localStorage.getItem('userName');

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.user-name').textContent = USERNAME;
});

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

document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
});

function renderSubcategories(subcategories, category_name) {
    const container = document.querySelector('.sub-cards-container');
    const title = document.getElementById('subcategory-title');
    title.textContent = category_name;

    subcategories.forEach(subcat => {
        const card = document.createElement('div');
        card.className = 'subcard';
        card.style.position = 'relative'

        card.innerHTML = `
            <div class="card-body">
                <div class="subtitle fs-5">${subcat.name}</div>
                <button class="subbtn btn btn-primary">Ver productos</button>
            </div>
        `;
        card.querySelector('.subbtn').onclick = () => selectSubcategory(subcat);
        container.appendChild(card);
    });
}

// Navegación por steps
let step = 1; // 1: categorías, 2: subcategorías, 3: productos
let currentCategory = null;
let currentSubcategory = null;
let lastSubcategories = [];

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

window.selectCategory = (category) => {
    currentCategory = category;
    step = 2;
    renderStep();
};

window.selectSubcategory = (subcategory) => {
    currentSubcategory = subcategory;
    step = 3;
    renderStep();
};

document.getElementById('back-to-categories').onclick = () => {
    step = 1;
    renderStep();
    // Limpiar subcategorías
    document.querySelector('.sub-cards-container').innerHTML = '';
};
document.getElementById('back-to-subcategories').onclick = () => {
    step = 2;
    renderStep();
    // Limpiar productos
    document.querySelector('.product-cards-container').innerHTML = '';
};

// Inicializar vista
renderStep();

// Lógica botón Cancelar Compra
const cancel = () => {
    localStorage.clear();
    moveToWelcome();
}

// Render product cards
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
        card.innerHTML = `
            <img class="product-img" src="/images/categories/alcohol.jpg" alt="${product.name}">
            <div class="product-name">${product.name}</div>
            <div class="product-price">$${product.price}</div>
            <div class="product-btn-container"></div>
        `;

        const btnContainer = card.querySelector('.product-btn-container');
        let cartObj = getCart();
        if (!cartObj || !Array.isArray(cartObj.products)) {
            cartObj = { products: [] };
        }
        const prodInCart = cartObj.products.find(p => p.id === product.id);

        if (prodInCart) {
            btnContainer.innerHTML = `
                <button class="btn btn-sm btn-danger btn-restar" style="margin-right: 5px;">-</button>
                <span class="cantidad-en-carrito">${prodInCart.quantity}</span>
                <button class="btn btn-sm btn-success btn-sumar" style="margin-left: 5px;">+</button>
            `;
            const btnSumar = btnContainer.querySelector('.btn-sumar');
            const btnRestar = btnContainer.querySelector('.btn-restar');
            const cantidadSpan = btnContainer.querySelector('.cantidad-en-carrito');

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
                <button class="btn text-light product-btn">+ Agregar</button>
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

