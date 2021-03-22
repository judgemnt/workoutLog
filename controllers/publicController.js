const Program = require("../models/programSchema");
const Workout = require("../models/workoutSchema");
const Exercise = require("../models/exerciseSchema");

module.exports.publicPrograms = async (req, res) => {
    const programs = await Program.find({ public: true });
    res.render("workout/index", { programs });
};

module.exports.publicWorkouts = async (req, res) => {
    const { id } = req.params;
    const workouts = await Workout.find({ program: { $in: id } })
    const program = await Program.findById(id)
    res.render("workout/allWorkouts", { program, workouts });
};

module.exports.publicWorkout = async (req, res) => {
    const { workoutId } = req.params;
    const program = await Program.findOne({ workouts: workoutId });
    const workout = await Exercise.find({ workout: { $in: workoutId } });
    res.render("workout/details", { workout, program });
};