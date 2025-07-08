const express = require("express");
const router = express.Router();
const { getSubcategories, getSubcategoryByCategory } = require("../../controllers/common/subcategoryController.js");

// Obtener subcategorías por id de categoría
router.get("/:category_id", getSubcategoryByCategory);
// Obtener todas las subcategorías
router.get("/", getSubcategories);

module.exports = router;

