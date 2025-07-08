const express = require("express");
const router = express.Router();

const { getCategories } = require("../../controllers/common/categoryController.js");

// Cargar categorías
router.get("/", getCategories);

module.exports = router;

