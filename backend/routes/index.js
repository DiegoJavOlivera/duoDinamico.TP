/**
 * @fileoverview Define el router principal de la API backend y monta todas las subrutas.
 * Cada subruta está dedicada a un recurso o funcionalidad específica del sistema.
 * 
 * Subrutas:
 * - /ticket: Gestión de ventas y tickets (público)
 * - /auth: Autenticación de usuarios (login, registro, etc.)
 * - /products: Gestión y consulta de productos
 * - /subcategories: Gestión y consulta de subcategorías
 * - /categories: Gestión y consulta de categorías
 * - /admin/actions: Acciones administrativas (solo SuperAdmin, requiere autenticación)
 * - /admin: Funcionalidades administrativas generales (solo Admin, requiere autenticación)
 * 
 * Los middlewares de autenticación y autorización se aplican según corresponda para proteger rutas sensibles.
 */

const express = require("express");

const adminRouter = require("./admin"); // Funcionalidades administrativas generales
const productRouter = require("./common/productRouter"); // Productos: CRUD y consulta
const subcategoryRouter = require("./common/subcategoryRouter"); // Subcategorías: CRUD y consulta
const categoryRouter = require("./common/categoryRouter"); // Categorías: CRUD y consulta
const authRouter = require("./auth/authRouter"); // Autenticación: login, registro, etc.
const createTicket = require("./common/saleRouter"); // Ventas/tickets
const actionstRouter = require("./admin/actionsRouter"); // Acciones administrativas (solo SuperAdmin)
const { isAdmin, isAuthenticate, isSuperAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

// Rutas públicas y de recursos
router.use("/ticket", createTicket); // Gestión de ventas/tickets
router.use("/auth", authRouter); // Login, registro, etc.
router.use("/products", productRouter); // Productos
router.use("/subcategories", subcategoryRouter); // Subcategorías
router.use("/categories", categoryRouter); // Categorías

// Rutas administrativas protegidas
router.use("/admin/actions", isAuthenticate, isSuperAdmin, actionstRouter); // Acciones solo SuperAdmin
router.use("/admin", isAuthenticate, isAdmin, adminRouter); // Funcionalidades Admin

module.exports = router;

