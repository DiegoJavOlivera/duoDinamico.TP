const express = require("express");

const adminRouter = require("./admin");
const productRouter = require("./common/productRouter");
const authRouter = require("./auth/authRouter");

const { isAdmin, isAuthenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/admin", isAuthenticate, isAdmin, adminRouter);

module.exports = router;

