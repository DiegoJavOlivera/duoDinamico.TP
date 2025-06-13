const express = require("express");
const { signIn } = require("../../controllers/auth/authController");

const router = express.Router();

router.post("/login", signIn);

module.exports = router;