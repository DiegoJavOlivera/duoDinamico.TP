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
    let cart = getCart();
    
    const idx = cart.findIndex(p => p.id === productId);
    if (idx > -1) {
        if (cart[productId].cantidad > 1) {
            cart[productId].cantidad -= 1;
        } else {
            cart.splice(productId, 1);
        }
    }
    setCart(cart);
}
  
function getCartCount() {
    return getCart().reduce((acc, p) => acc + p.cantidad, 0);
}