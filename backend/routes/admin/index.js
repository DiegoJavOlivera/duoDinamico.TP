const express = require('express');

const userRouter = require('./userRouter');
const { isSuperAdmin } = require('../../middlewares/auth.middleware');

const router = express.Router();

// Rutas protegidas (solo SuperAdmin)
router.use('/users', isSuperAdmin, userRouter);

module.exports = router;
