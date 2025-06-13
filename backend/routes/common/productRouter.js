const express = require("express");
const router = express.Router();

const { getProducts, getProductById } = require("../../controllers/common/productController");

// este endpoint en el futuro va a recibir filtros para filtrar por categoria, subcategoria, rol, etc

router.get("/", getProducts);
router.get("/:id", getProductById);

module.exports = router;