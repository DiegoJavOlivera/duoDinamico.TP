const express = require('express');

const userRouter = require('./userRouter');
const { isSuperAdmin } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use('/users', isSuperAdmin, userRouter);

module.exports = router;
