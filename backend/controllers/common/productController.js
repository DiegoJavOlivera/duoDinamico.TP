const {getProductById, getAllProducts} = require("../../repository/productRepository");
const { validateProductId, validateProductData } = require("../../utils/productUtil");

const getProducts = async (req, res) => {
    try {
        const products = await getAllProducts();
        if(validateProductData(products)){
            res.status(404).json({ message: "No products found" });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        validateProductId(id)
        const product = await getProductById(id);
        if(validateProductData([product])){
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProducts, 
    getProduct
};