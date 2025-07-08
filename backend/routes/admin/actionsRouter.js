const express = require("express");
const router = express.Router();

const { getActions } = require("../../controllers/superAdmin/actionsController");

// Obtener todas las acciones
router.get("/", getActions);

module.exports = router;