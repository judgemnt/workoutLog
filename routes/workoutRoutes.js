const express = require("express");
const router = express.Router({ mergeParams: true });
const workout = require("../controllers/workoutController");

router.post("/", workout.new);

router.route("/workouts")
    .get(workout.workouts)
    .delete(workout.delete);

module.exports = router;