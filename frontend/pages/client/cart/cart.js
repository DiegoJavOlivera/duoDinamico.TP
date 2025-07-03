// Renderiza productos del carrito
const USERNAME = localStorage.getItem('userName');

function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    let cartObj = getCart();
    if (!cartObj || !Array.isArray(cartObj.products)) {
        cartObj = { products: [] };
    }
    const products = cartObj.products;

    // Secciones
    const sectionCartFull = document.getElementById('section-cart-full');
    const sectionCartEmpty = document.getElementById('section-cart-empty');

    if (!products.length) {
        // Mostrar solo la sección de carrito vacío
        sectionCartFull.classList.add('d-none');
        sectionCartEmpty.classList.remove('d-none');
        cartCount.textContent = '0';
        cartTotal.textContent = '$0';
        const volverBtn = document.getElementById('btn-volver-lista');
        if (volverBtn) {
            volverBtn.addEventListener('click', () => {
                window.location.href = '/pages/client/list/list.html';
            });
        }
        return;
    } else {
        sectionCartFull.classList.remove('d-none');
        sectionCartEmpty.classList.add('d-none');
    }
    cartItemsContainer.innerHTML = '';


    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'card cart-item d-flex flex-row align-items-center justify-content-between';
        card.innerHTML = `
            <div class="cart-item-img-wrap d-flex align-items-center justify-content-center" style="flex:0 0 64px;">
                <img class="cart-item-img" src="/images/categories/alcohol.jpg" alt="${product.name}">
            </div>
            <div class="cart-item-info flex-grow-1 px-2">
                <div class="cart-item-title">${product.name}</div>
                <div class="cart-item-price">$${product.price} c/u</div>
            </div>
            <div class="cart-item-controls flex-shrink-0 d-flex align-items-center mx-2">
                <button class="btn-restar" aria-label="Restar">-</button>
                <span class="cart-item-qty">${product.quantity}</span>
                <button class="btn-sumar" aria-label="Sumar">+</button>
            </div>
            <div class="cart-item-actions flex-shrink-0 d-flex flex-column align-items-end" style="min-width: 80px;">
                <div class="cart-item-price fw-bold fs-5">$${product.price * product.quantity}</div>
                <button class="cart-item-delete mt-2" aria-label="Eliminar"><i class="bi bi-trash"></i></button>
            </div>
        `;
        // Controles sumar/restar
        card.querySelector('.btn-sumar').addEventListener('click', () => {
            const currentQty = product.quantity;
            const stock = product.stock;
            if (currentQty >= stock) {
                alert('No hay más stock disponible para este producto');
                return;
            }
            addToCart(product);
            renderCart();
        });
        card.querySelector('.btn-restar').addEventListener('click', () => {
            removeFromCart(product.id);
            renderCart();
        });
        card.querySelector('.cart-item-delete').addEventListener('click', () => {
            // Elimina el producto completamente
            let cartObj = getCart();
            if (!cartObj || !Array.isArray(cartObj.products)) cartObj = { products: [] };
            const idx = cartObj.products.findIndex(p => p.id === product.id);
            if (idx > -1) {
                cartObj.products.splice(idx, 1);
                setCart(cartObj);
            }
            renderCart();
        });
        cartItemsContainer.appendChild(card);
    });
    // Actualiza resumen
    cartCount.textContent = products.reduce((acc, p) => acc + p.quantity, 0);
    cartTotal.textContent = '$' + getCartTotal();
}

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    document.getElementById('btn-volver').addEventListener('click', () => {
        window.history.back();
    });
    document.getElementById('btn-finalizar').addEventListener('click', () => {
        const conf = confirm('¿Desea finalizar la compra?');

        const ticketPayload = {
            nameCostumer: USERNAME,
            products: getCart().products,
            total: getCartTotal()
        }

        if (conf) {
            createTicket(ticketPayload).then((ticketResponse) => {
                if (ticketResponse && ticketResponse.success) {
                    localStorage.setItem('ticket', JSON.stringify(ticketResponse.ticket));
                    moveToTicket();
                } else {
                    alert('Ocurrió un error durante la compra. Intenta nuevamente.');
                }
            }).catch(() => {
                alert('Ocurrió un error durante la compra. Intenta nuevamente.');
            });
        }
    });

    document.getElementById('cart-client').textContent = USERNAME;
});
