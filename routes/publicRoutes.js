const express = require("express");
const router = express.Router();
const public = require("../controllers/publicController");

router.get("/", public.publicPrograms)

router.get("/:id/workouts", public.publicWorkouts)

router.get("/:id/workouts/:workoutId", public.publicWorkout)

module.exports = router