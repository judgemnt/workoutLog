const express = require("express");
const router = express.Router();
const personal = require("../controllers/personalController");

router.route("/wilks")
    .get(personal.wilks)
    .post(personal.calculateWilks)

router.route("/bfCalc")
    .get(personal.bodyFat)
    .post(personal.calculateBF)

module.exports = router