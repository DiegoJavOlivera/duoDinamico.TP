

const isProductEmpty = (productData) => {
    if(!productData || productData.length === 0){
        return true;
    }
}

const isDataProductValid = (produc) => {
    if(produc.name && produc.description && produc.image && produc.price && produc.stock && produc.category_id && produc.subcategory_id){
        return true;
    }
}
// hay que mejorar esta validacion

module.exports = {
    isProductEmpty,
    isDataProductValid
}