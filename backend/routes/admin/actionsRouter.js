const express = require("express");
const router = express.Router();

const { getActions } = require("../../controllers/superAdmin/actionsController");

router.get("/", getActions);

module.exports = router;