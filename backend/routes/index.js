const express = require("express");

const adminRouter = require("./admin");
const productRouter = require("./common/productRouter");
const subcategoryRouter = require("./common/subcategoryRouter");
const categoryRouter = require("./common/categoryRouter");
const authRouter = require("./auth/authRouter");
const createTicket = require("./common/saleRouter");
const actionstRouter = require("./admin/actionsRouter");
const { isAdmin, isAuthenticate, isSuperAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use("/ticket", createTicket)
router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/subcategories", subcategoryRouter);
router.use("/categories", categoryRouter);
router.use("/admin/actions", isAuthenticate, isSuperAdmin, actionstRouter);
router.use("/admin", isAuthenticate, isAdmin, adminRouter);

module.exports = router;

