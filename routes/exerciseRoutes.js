const express = require("express");
const router = express.Router({ mergeParams: true });
const exercise = require("../controllers/exerciseController");

router.route("/")
    .get(exercise.show)
    .post(exercise.new)
    .delete(exercise.delete);

module.exports = router