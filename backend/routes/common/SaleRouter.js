const express = require('express');
const router = express.Router();
const { createTicket } = require('../../controllers/common/SaleController');

router.post("/", createTicket);


module.exports = router;