const {getProductById, getAllProducts, addProduct} = require("../../repository/productRepository");
const {addLog} = require("../../repository/logRepository");


const {getConfig} = require("../../config/index");

const { isValidId, isAllValid } = require("../../utils/commons");
const InvalidIdException = require("../../errors/invalidIdException");

const ACTION_ID = 1;

const getProducts = async (req, res) => {
    try {
        const { all, subcategory } = req.query;
        console.log(all, subcategory)
        const allBoolean = all === 'true';

        const products = await getAllProducts(allBoolean, subcategory);

        if(!isAllValid(products)){
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
        if(!isValidId(id)){
            throw new InvalidIdException(`The PRODUCT ID "${id}" is not valid`);
        }
        const product = await getProductById(id);
        if(isAllValid([product])){
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: error.message });
    }
};

const createProduct = async (req, res) => {
    try {

        let {name,
            description,
            price,
            stock,
            category_id,
            subcategory_id} = req.body;
        
        stock = parseInt(stock);
        price = parseFloat(price);
        category_id = parseInt(category_id);
        subcategory_id = parseInt(subcategory_id);
    
        const image = req.file.filename;
        
        if(!isAllValid([name, description, image, price, stock, category_id, subcategory_id])){
            return res.status(400).json({ message: "Invalid product data" });
        }


        const imagePath = getConfig("IMAGE_PATH") 

        const newProduct = {
            name,
            description,
            image: `${imagePath}/${image}`,
            price,
            stock,
            category_id,
            subcategory_id
        };

        const create =  await addProduct(newProduct);
        if(!create){
            return res.status(500).json({ message: "Error creating product" });
        }

        const createLog = await addLog({
            user_id: req.user.dataValues.id,
            product_id: create.dataValues.id,
            action_id: ACTION_ID, 
        })

        if(!createLog){
            return res.status(500).json({ message: "Error creating log" });
        }

        res.status(201).json({ message: "Product created successfully", product: create });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }

}

module.exports = {
    getProducts, 
    getProduct,
    createProduct
};