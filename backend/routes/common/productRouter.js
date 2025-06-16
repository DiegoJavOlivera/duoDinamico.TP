const express = require("express");
const router = express.Router();

const { getProducts, getProduct } = require("../../controllers/common/productController");

// este endpoint en el futuro va a recibir filtros para filtrar por categoria, subcategoria, rol, etc

router.get("/", getProducts);
router.get("/:id", getProduct);

module.exports = router;