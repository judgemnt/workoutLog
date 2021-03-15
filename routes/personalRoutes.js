const express = require("express");
const router = express.Router();
const personal = require("../controllers/personalController");

router.route("/wilks")
    .get(personal.wilks)
    .post(personal.calculateWilks)

module.exports = router