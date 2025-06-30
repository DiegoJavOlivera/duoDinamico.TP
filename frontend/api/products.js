
function getProducts(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`products?${query}`);
}

function getProductById(id) {
  return apiFetch(`products/${id}`);
}