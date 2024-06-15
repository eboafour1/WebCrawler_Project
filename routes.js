const express = require("express");
const router = express.Router();
const {main} = require('./main')

router.route("/crawler").get(main);

module.exports = router