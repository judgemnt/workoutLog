const express = require("express");
const router = express.Router();
const personal = require("../controllers/personalController");
const passport = require("passport")

router.route("/wilks")
    .get(personal.wilks)
    .post(personal.calculateWilks)

router.route("/bfCalc")
    .get(personal.bodyFat)
    .post(personal.calculateBF)

router.route("/register")
    .get(personal.registerForm)
    .post(personal.register)

router.route("/login")
    .get(personal.loginForm)
    .post(passport.authenticate("local", { failureRedirect: "/login" }), personal.login)

router.get("/logout", personal.logout)
module.exports = router