const express = require("express");
const { createUser } = require("../../controllers/superAdmin/userController");

const router = express.Router();

router.post("/", createUser);

module.exports = router;