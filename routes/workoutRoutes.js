const express = require("express");
const router = express.Router({ mergeParams: true });
const workout = require("../controllers/workoutController");
const { isLoggedIn } = require("../middleware")

router.post("/", isLoggedIn, workout.new);

router.route("/workouts")
    .get(isLoggedIn, workout.workouts)
    .patch(isLoggedIn, workout.editWorkout)
    .delete(isLoggedIn, workout.delete);

router.route("/workouts/edit")
    .get(isLoggedIn, workout.editForm)

module.exports = router;