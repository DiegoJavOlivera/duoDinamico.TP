

const isProductEmpty = (productData) => {
    if(!productData || productData.length === 0){
        return true;
    }
}


module.exports = {
    isProductEmpty
}