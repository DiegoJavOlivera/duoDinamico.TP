const express = require("express");
const router = express.Router();
const getSubcategories = require("../../controllers/common/subcategoryController.js");

const getSubcategoryByCategory = require("../../controllers/common/subcategoryController.js");

router.get("/:category_id", getSubcategoryByCategory);
router.get("/", getSubcategories);

module.exports = router;

