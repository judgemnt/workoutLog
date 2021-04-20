const express = require("express");
const router = express.Router();
const public = require("../controllers/publicController");
const { isLoggedIn } = require("../middleware");

router.route("/")
    .get(public.publicPrograms)
    .post(public.saveProgram)

router.get("/:id/workouts", public.publicWorkouts)

router.route("/:id/copy")
    .get(isLoggedIn, public.editAndCopyPage)

router.get("/:id/workouts/:workoutId", public.publicWorkout)

module.exports = router