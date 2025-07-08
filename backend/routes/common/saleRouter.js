const express = require('express');
const router = express.Router();
const { createTicket, getTickets } = require('../../controllers/common/SaleController');
const { isAuthenticate, isSuperAdmin } = require('../../middlewares/auth.middleware');


router.post("/", createTicket);
router.get("/",isAuthenticate, isSuperAdmin ,getTickets)

module.exports = router;