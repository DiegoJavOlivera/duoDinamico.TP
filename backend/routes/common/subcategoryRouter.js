const express = require("express");
const router = express.Router();

const getSubcategoryByCategory = require("../../controllers/common/subcategoryController.js");

router.get("/:category_id", getSubcategoryByCategory);

module.exports = router;

