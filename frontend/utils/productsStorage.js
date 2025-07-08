/**
 * Obtiene el carrito de compras desde localStorage.
 *
 * @returns {Object} Objeto con la propiedad 'products' (array de productos) o array vacío si no existe.
 */
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}
  
/**
 * Guarda el carrito de compras en localStorage.
 *
 * @param {Object} cart - Objeto carrito a guardar.
 */
function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}
  
/**
 * Agrega un producto al carrito. Si ya existe, incrementa su cantidad.
 *
 * @param {Object} product - Producto a agregar (debe tener id, image, name, description, price, stock).
 */
function addToCart(product) {
    let cartObj = getCart();

    if (!Array.isArray(cartObj.products)) {
        cartObj = { products: [] };
    }

    const idx = cartObj.products.findIndex(p => p.id === product.id);

    if (idx > -1) {
        cartObj.products[idx].quantity += 1;
    } else {
        cartObj.products.push({
            id: product.id,
            image: product.image,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            quantity: 1
        });
    }

    setCart(cartObj);
}
  
/**
 * Elimina una unidad de un producto del carrito. Si es la última, lo quita del carrito.
 *
 * @param {number|string} productId - ID del producto a eliminar.
 */
function removeFromCart(productId) {
    let cartObj = getCart();
    if (!cartObj || !Array.isArray(cartObj.products)) {
        cartObj = { products: [] };
    }
    const idx = cartObj.products.findIndex(p => p.id === productId);
    if (idx > -1) {
        if (cartObj.products[idx].quantity > 1) {
            cartObj.products[idx].quantity -= 1;
        } else {
            cartObj.products.splice(idx, 1);
        }
        setCart(cartObj);
    }
}

// Devuelve el total del carrito
/**
 * Calcula el total del carrito (precio * cantidad de cada producto).
 *
 * @returns {number} Total en dinero del carrito.
 */
function getCartTotal() {
    let cartObj = getCart();
    if (!cartObj || !Array.isArray(cartObj.products)) {
        return 0;
    }
    return cartObj.products.reduce((acc, p) => acc + (p.price * p.quantity), 0);
}

/**
 * Devuelve la cantidad total de productos en el carrito.
 *
 * @returns {number} Cantidad total de unidades en el carrito.
 */
function getCartCount() {
    return getCart().products?.reduce((acc, p) => acc + p.quantity, 0);
}