const Workout = require("../models/workoutSchema");
const Program = require("../models/programSchema");
const Exercise = require("../models/exerciseSchema");

//Create new workouts for a program
module.exports.new = async (req, res) => {
    const { id } = req.params;
    const program = await Program.findById(id);
    const workout = new Workout({
        session: req.body.workouts.session,
        description: req.body.workouts.description,
        program: id
    });
    await workout.save();
    await program.updateOne({ $push: { workouts: workout } });
    res.redirect(`/programs/${id}/workouts`);
};

//Shows all workouts in a specific program
module.exports.workouts = async (req, res) => {
    const { id } = req.params;
    const allWorkouts = await Program.findById(id).populate("workouts");
    res.render("workout/allWorkouts", { allWorkouts });
};

//Delete workouts from a program
module.exports.delete = async (req, res) => {
    const workoutIds = req.body.workouts.workout;
    const workout = await Workout.find({ _id: { $in: workoutIds } });
    const programId = workout[0].program;
    const program = await Program.findById(programId)
    const deleteExercises = await Exercise.deleteMany({ workout: { $in: workoutIds } });
    const deleteWorkout = await Workout.deleteMany({ _id: { $in: workoutIds } });
    const newProgram = await program.updateOne({ $pull: { workouts: { $in: workoutIds } } });
    res.redirect(`/programs/${programId}/workouts`);
};