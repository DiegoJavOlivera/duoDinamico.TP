const express = require('express');
const router = express.Router();

const { createTicket, getTickets } = require('../../controllers/common/SaleController');
const { isAuthenticate, isSuperAdmin } = require('../../middlewares/auth.middleware');


// Crear ticket 
router.post("/", createTicket);
// Obtener tickets (super admin, autenticado)
router.get("/",isAuthenticate, isSuperAdmin , getTickets)

module.exports = router;