const express = require("express");
const router = express.Router();
const public = require("../controllers/publicController");

router.route("/")
    .get(public.publicPrograms)
    .post(public.saveProgram)

router.get("/:id/workouts", public.publicWorkouts)

router.route("/:id/copy")
    .get(public.editAndCopyPage)

router.get("/:id/workouts/:workoutId", public.publicWorkout)

module.exports = router