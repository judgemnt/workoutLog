const express = require("express");
const router = express.Router();
const personal = require("../controllers/personalController");
const passport = require("passport");
const catchAsync = require("../utilities/catchAsync");
const { validatePersonal } = require("../middleware")

router.route("/wilks")
    .get(catchAsync(personal.wilks))
    .post(validatePersonal, catchAsync(personal.calculateWilks))

router.route("/bfCalc")
    .get(catchAsync(personal.bodyFat))
    .post(validatePersonal, catchAsync(personal.calculateBF))

//router.route("/plateMath")

router.route("/register")
    .get(personal.registerForm)
    .post(validatePersonal, catchAsync(personal.register))

router.route("/login")
    .get(personal.loginForm)
    .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), personal.login)

router.get("/logout", personal.logout)

module.exports = router