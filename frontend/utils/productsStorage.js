function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}
  
function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}
  
function addToCart(product) {
    let cartObj = getCart();

    if (!Array.isArray(cartObj.products)) {
        cartObj = { products: [] };
    }

    const idx = cartObj.products.findIndex(p => p.id === product.id);

    if (idx > -1) {
        cartObj.products[idx].cantidad += 1;
    } else {
        cartObj.products.push({
            id: product.id,
            nombre: product.name || product.nombre,
            precio: product.price || product.precio,
            cantidad: 1
        });
    }

    setCart(cartObj);
}
  
function removeFromCart(productId) {
    let cartObj = getCart();
    if (!cartObj || !Array.isArray(cartObj.products)) {
        cartObj = { products: [] };
    }
    const idx = cartObj.products.findIndex(p => p.id === productId);
    if (idx > -1) {
        if (cartObj.products[idx].cantidad > 1) {
            cartObj.products[idx].cantidad -= 1;
        } else {
            cartObj.products.splice(idx, 1);
        }
        setCart(cartObj);
    }
}

// Devuelve el total del carrito
function getCartTotal() {
    let cartObj = getCart();
    if (!cartObj || !Array.isArray(cartObj.products)) {
        return 0;
    }
    return cartObj.products.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
}

function getCartCount() {
    return getCart().products.reduce((acc, p) => acc + p.cantidad, 0);
}