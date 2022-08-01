const express = require("express");
const router = express.Router();
const { createRoom } = require("../Controllers/createroom");

router.post("/createroom", createRoom)

module.exports = router;