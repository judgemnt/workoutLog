const Workout = require("../models/workoutSchema");
const Exercise = require("../models/exerciseSchema");

//show all exercises for a specific workout
module.exports.show = async (req, res) => {
    const { workoutId } = req.params;
    const workout = await Workout.findById(workoutId).populate("exercises");
    res.render("workout/details", { workout });
};

//create new exercise for a specific workout
module.exports.new = async (req, res) => {
    const { workoutId } = req.params;
    const workout = await Workout.findById(workoutId);
    const id = workout.program;
    const newExercise = new Exercise({
        exercise: req.body.exercises.exercise,
        sets: req.body.exercises.sets,
        reps: req.body.exercises.reps,
        workout: workoutId
    });
    await newExercise.save();
    await workout.updateOne({ $push: { exercises: newExercise } });
    res.redirect(`/programs/${id}/workouts/${workoutId}`);
};

//delete an exercise from a specific workout
module.exports.delete = async (req, res) => {
    const exerciseIds = req.body.exercises.exercise;
    const exercises = await Exercise.find({ _id: { $in: exerciseIds } });
    const workoutId = exercises[0].workout;
    const workout = await Workout.findById(workoutId);
    const id = workout.program;
    await workout.updateOne({ $pull: { exercises: { $in: exerciseIds } } });
    const removeExercise = await Exercise.deleteMany({ _id: { $in: exerciseIds } });
    res.redirect(`/programs/${id}/workouts/${workoutId}`);
};