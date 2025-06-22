const express = require("express");

const adminRouter = require("./admin");
const productRouter = require("./common/productRouter");
const subcategoryRouter = require("./common/subcategoryRouter");
const authRouter = require("./auth/authRouter");

const { isAdmin, isAuthenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/subcategories", subcategoryRouter);
router.use("/admin", isAuthenticate, isAdmin, adminRouter);

module.exports = router;

