const express = require("express");
const router = express.Router();

const { getProducts, getProduct } = require("../../controllers/common/productController");
const { isAuthenticate, isAdmin } = require("../../middlewares/auth.middleware");
const { createProduct, updateProduct, deleteProduct } = require("../../controllers/common/productController");
const { upload, uploadOptional } = require("../../middlewares/upload.middleware");

// Obtener todos los productos (público)
router.get("/", getProducts);
// Obtener un producto por ID (público)
router.get("/:id", getProduct);
// Crear producto (admin, autenticado, imagen requerida)
router.post("/", isAuthenticate, isAdmin, upload, createProduct);
// Actualizar producto (admin, autenticado, imagen opcional)
router.put("/:id", isAuthenticate, isAdmin, uploadOptional, updateProduct);
// Eliminar producto (admin, autenticado)
router.patch("/:id", isAuthenticate, isAdmin, deleteProduct);

module.exports = router;

