const express = require("express");
const { createUser, getUsers } = require("../../controllers/superAdmin/userController");

const router = express.Router();

// Crear usuario (super admin, autenticado)
router.post("/", createUser);
// Obtener todos los usuarios (super admin, autenticado)
router.get("/", getUsers);

module.exports = router;