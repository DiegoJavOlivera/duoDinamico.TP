const {getProductById, getAllProducts} = require("../../repository/productRepository");
const { isProductEmpty } = require("../../utils/productUtil");
const { isValidId } = require("../../utils/commons")
const InvalidIdException = require("../../errors/invalidIdException");

const getProducts = async (req, res) => {
    try {
        const products = await getAllProducts();
        if(isProductEmpty(products)){
            res.status(404).json({ message: "No products found" });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProduct = async (req, res) => {s
    try {
        const { id } = req.params;
        if(!isValidId(id)){
            throw new InvalidIdException(`The PRODUCT ID "${id}" is not valid`);
        }
        const product = await getProductById(id);
        if(isProductEmpty([product])){
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