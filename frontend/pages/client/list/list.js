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

// Render subcategory cards
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
    const title = document.getElementById('product-title');
    title.textContent = subcategory_name;

    container.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img class="product-img" src="/images/categories/alcohol.jpg" alt="${product.name}">
            <div class="product-name">${product.name}</div>
            <div class="product-price">$${product.price}</div>
            <button class="btn text-light product-btn">+ Agregar</button>
        `;
        container.appendChild(card);
    });
}
