const {getProductById, getAllProducts, addProduct, updateProduct: updateProductRepository} = require("../../repository/productRepository");
const {addLog} = require("../../repository/logRepository");


const {getConfig} = require("../../config/index");

const { isValidId, isAllValid } = require("../../utils/commons");
const InvalidIdException = require("../../errors/invalidIdException");

const ACTION_ID_CREATE = 1;
const ACTION_ID_UPDATE = 2;
const ACTION_ID_MODIFY_ACTIVE = 4;
const ACTION_ID_MODIFY_INACTIVE = 5;

/**
 * Obtiene todos los productos, opcionalmente filtrados por subcategoría o todos.
 *
 * @param {import('express').Request} req - Request HTTP (puede incluir query all/subcategory)
 * @param {import('express').Response} res - Response HTTP
 * @returns {Promise<void>} Responde con 200 y array de productos, 404 si no hay, 500 si hay error
 */
const getProducts = async (req, res) => {
    try {
        const { all, subcategory } = req.query;
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

/**
 * Obtiene un producto por su ID.
 *
 * @param {import('express').Request} req - Request HTTP (requiere param id)
 * @param {import('express').Response} res - Response HTTP
 * @returns {Promise<void>} Responde con 200 y producto, 404 si no existe, 400/500 si hay error
 */
const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if(!isValidId(id)){
            throw new InvalidIdException(`The PRODUCT ID "${id}" is not valid`);
        }
        const product = await getProductById(id);
        if(!isAllValid([product])){
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: error.message });
    }
};

/**
 * Elimina un producto por su ID.
 *
 * @param {import('express').Request} req - Request HTTP (requiere param id)
 * @param {import('express').Response} res - Response HTTP
 * @returns {Promise<void>} Responde con 200 y mensaje de éxito, 404 si no existe, 400/500 si hay error
 */
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product_id = parseInt(id);
        
        if(!isValidId(product_id)){
            throw new InvalidIdException(`The PRODUCT ID "${product_id}" is not valid`);
        }
        const product = await getProductById(product_id);
        if(!isAllValid([product])){
            return res.status(404).json({ message: "Product not found" });
        }
        let productStatus = !product.is_active; 

        const deletedProduct = await updateProductRepository(product_id, { is_active: productStatus});
        if(!deletedProduct){
            return res.status(500).json({ message: "Error deleting product" });
        }
        const createLog = await addLog({
            user_id: req.user.dataValues.id,
            product_id: product_id,
            action_id: productStatus ? ACTION_ID_MODIFY_ACTIVE: ACTION_ID_MODIFY_INACTIVE, 
        });

        if(!createLog){
            return res.status(500).json({ message: "Error creating log" });
        }
        res.status(200).json({ message: "Product deleted successfully, the product chenges to false" });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: error.message });
    }
}

/**
 * Crea un nuevo producto.
 *
 * - Valida los datos recibidos en el body.
 * - Verifica que la subcategoría exista.
 * - Almacena la imagen en el servidor y crea el producto.
 * - Registra la acción en el log.
 * - Devuelve el producto creado (sin contraseña).
 *
 * @param {import('express').Request} req - Request HTTP (requiere body con datos del producto)
 * @param {import('express').Response} res - Response HTTP
 * @returns {Promise<void>} Responde con 201 y producto creado, o error 400/500
 */
const createProduct = async (req, res) => {
    try {
        console.log("Creating product with data:", req.body);
        console.log("Uploaded file:", req.file);

        let {name,
            description,
            price,
            stock,
            subcategory_id} = req.body;
        
        stock = parseInt(stock);
        price = parseFloat(price).toFixed(2);
        subcategory_id = parseInt(subcategory_id);


        const image = req.file.filename;

        
        if(!isAllValid([name, description, image, price, stock, subcategory_id])){
            return res.status(400).json({ message: "Invalid product data" });
        }


        const imagePath = getConfig("IMAGE_LOAD") 

        const newProduct = {
            name,
            description,
            image: `${imagePath}/${image}`,
            price,
            stock,
            subcategory_id
        };

        const create =  await addProduct(newProduct);
        if(!create){
            return res.status(500).json({ message: "Error creating product" });
        }

        const createLog = await addLog({
            user_id: req.user.dataValues.id,
            product_id: create.dataValues.id,
            action_id: ACTION_ID_CREATE, 
        })

        if(!createLog){
            return res.status(500).json({ message: "Error creating log" });
        }

        res.status(201).json({ message: "Product created successfully", product: create });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }

}

/**
 * Actualiza un producto por su ID.
 *
 * - Valida los datos recibidos en el body.
 * - Verifica que el producto exista y la subcategoría sea válida.
 * - Si hay una nueva imagen, la almacena y actualiza el producto.
 * - Registra la acción en el log.
 * - Devuelve el producto actualizado (sin contraseña).
 *
 * @param {import('express').Request} req - Request HTTP (requiere param id y body con datos del producto)
 * @param {import('express').Response} res - Response HTTP
 * @returns {Promise<void>} Responde con 200 y producto actualizado, 404 si no existe, 400/500 si hay error
 */
const updateProduct = async (req, res) => {
    try {

        const { id } = req.params;
        const productId = parseInt(id);
        
        // Validar que el ID sea válido
        if(!isValidId(productId)){
            throw new InvalidIdException(`The PRODUCT ID "${id}" is not valid`);
        }
        
        // Obtener el producto actual para mantener la imagen si no se envía una nueva
        const currentProduct = await getProductById(productId);
        if (!currentProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
         
        const { name, description, price, stock, subcategory_id } = req.body;
        
        // Manejar la imagen: si hay archivo nuevo, usar el nuevo; si no, mantener el actual
        let image;
        if (req.file) {
            // Nueva imagen enviada
            image = req.file.filename;
        } else {
            // Mantener imagen actual (extraer solo el nombre del archivo de la ruta completa)
            const currentImagePath = currentProduct.image;
            image = currentImagePath ? currentImagePath.split('/').pop() : null;
        }

        const imagePath = getConfig("IMAGE_LOAD");

        const updatedProduct = {
            name,
            description,
            image: image ? `${imagePath}/${image}` : currentProduct.image,
            price: parseFloat(price),
            stock: parseInt(stock),
            subcategory_id: parseInt(subcategory_id)
        };

        const update = await updateProductRepository(productId, updatedProduct);
        if (!update) {
            return res.status(500).json({ message: "Error updating product" });
        }
        
        const createLog = await addLog({
            user_id: req.user.dataValues.id,
            product_id: productId,
            action_id: ACTION_ID_UPDATE, 
        });

        if (!createLog) {
            return res.status(500).json({ message: "Error creating log" });
        }
        
        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });

    } catch (error) {
        console.error('Error in updateProduct:', error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: error.message || "Internal server error" });
    }
}

module.exports = {
    getProducts, 
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct  
};