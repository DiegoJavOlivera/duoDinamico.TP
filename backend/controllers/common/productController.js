const {getProductById, getAllProducts, addProduct} = require("../../repository/productRepository");
const {addLog} = require("../../repository/logRepository");
const {getAllActions} = require("../../repository/actionRepository");

const { isProductEmpty, isDataProductValid } = require("../../utils/productUtil");
const { isValidId } = require("../../utils/commons");
const InvalidIdException = require("../../errors/invalidIdException");
const {verifyToken} = require("../../utils/jwtUtils");


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

const getProduct = async (req, res) => {
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
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        
        if(!isDataProductValid(req.body)){
            return res.status(400).json({ message: "Invalid product data" });
        }
        const headerData = req.headers.authorization;
        const token = headerData.split(" ")[1];
        const dataUser = verifyToken(token); // el id del admin actual lo saco del token quizas hay que abstraer esto a una funcion en utils 

        const {name,
            description,
            image,
            price,
            stock,
            category_id,
            subcategory_id} = req.body;
        
        const imagePath = process.env.IMAGE_PATH //Pri mira esto por favor ,despues habria que acomodarlo 

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
            return res.status(400).json({ message: "Error creating product" });
        }
        const createLog = await addLog({
            user_id: dataUser.id,
            product_id: create.id,
            action_id: 1, // a esto despues habria que acomodarlo por que esta Hardcodeado
            created_at: new Date()
        })
        if(!createLog){
            return res.status(400).json({ message: "Error creating log" });
        }

        res.status(201).json({ message: "Log created successfully", log: createLog });
        res.status(201).json({ message: "Product created successfully", product: create });

    } catch (error) {
        res.status(500).json({ message: "Error Nuevo" });
    }

}

module.exports = {
    getProducts, 
    getProduct,
    createProduct
};