const express = require("express");
const router = express.Router({ mergeParams: true });
const exercise = require("../controllers/exerciseController");
const { isLoggedIn } = require("../middleware");

router.route("/")
    .get(isLoggedIn, exercise.show)
    .post(isLoggedIn, exercise.new)
    .delete(isLoggedIn, exercise.delete)
    .patch(isLoggedIn, exercise.edit);

router.route("/edit")
    .get(isLoggedIn, exercise.showEdit);

module.exports = router