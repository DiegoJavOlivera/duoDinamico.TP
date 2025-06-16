

const validateProductId = (id) => {
    if (!id) {
        throw new Error("Product ID is required");
    }
    if (isNaN(id)) {
        throw new Error("Product ID must be a number");
    }
    if (id <= 0) {
        throw new Error("Product ID must be a positive number");
    }
}

const validateProductData = (productData) => {
    if(!productData || productData.length === 0){
        return true;
    }
}


module.exports = {
    validateProductId,
    validateProductData
}