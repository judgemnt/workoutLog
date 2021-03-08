const express = require("express");
const router = express.Router({ mergeParams: true });
const workout = require("../controllers/workoutController");

router.post("/", workout.new);

router.route("/workouts")
    .get(workout.workouts)
    .patch(workout.editWorkout)
    .delete(workout.delete);

router.route("/workouts/edit")
    .get(workout.editForm)

module.exports = router;