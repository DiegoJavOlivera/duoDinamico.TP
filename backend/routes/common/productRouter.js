const express = require("express");
const router = express.Router();

const { getProducts, getProduct } = require("../../controllers/common/productController");
const { isAuthenticate, isAdmin } = require("../../middlewares/auth.middleware");
const { createProduct } = require("../../controllers/common/productController");
const { upload } = require("../../middlewares/upload.middleware");


router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", isAuthenticate, isAdmin, upload, createProduct);

module.exports = router;