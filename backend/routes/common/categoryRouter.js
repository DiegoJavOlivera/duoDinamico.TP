const express = require("express");
const router = express.Router();

const { getCategories } = require("../../controllers/common/categoryController.js");

router.get("/", getCategories);

module.exports = router;

