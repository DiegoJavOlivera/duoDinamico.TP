
async function getSubcategoryByCategoryId(categoryId) {
  return await apiFetch(`subcategories/${categoryId}`);
}