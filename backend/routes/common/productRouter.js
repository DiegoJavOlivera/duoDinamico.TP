const express = require("express");
const router = express.Router();

const { getProducts, getProduct } = require("../../controllers/common/productController");
const { isAuthenticate, isAdmin } = require("../../middlewares/auth.middleware");
const { createProduct, updateProduct, deleteProduct } = require("../../controllers/common/productController");
const { upload, uploadOptional } = require("../../middlewares/upload.middleware");


router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", isAuthenticate, isAdmin, upload, createProduct);
router.put("/:id", isAuthenticate, isAdmin, uploadOptional, updateProduct);
router.patch("/:id", isAuthenticate, isAdmin, deleteProduct)

module.exports = router;