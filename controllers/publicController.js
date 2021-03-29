const Program = require("../models/programSchema");
const Workout = require("../models/workoutSchema");
const Exercise = require("../models/exerciseSchema");
const mongoose = require("mongoose");
const { db } = require("../models/exerciseSchema");

//Show all Public Programs
module.exports.publicPrograms = async (req, res) => {
    const programs = await Program.find({ public: true });
    res.render("workout/index", { programs });
};

//Show all workouts for a public Program
module.exports.publicWorkouts = async (req, res) => {
    const { id } = req.params;
    const workouts = await Workout.find({ program: { $in: id } })
    const program = await Program.findById(id)
    res.render("workout/allWorkouts", { program, workouts });
};

//Show all exercises for a public workout
module.exports.publicWorkout = async (req, res) => {
    const { workoutId } = req.params;
    const program = await Program.findOne({ workouts: workoutId });
    const workout = await Exercise.find({ workout: { $in: workoutId } });
    res.render("workout/details", { workout, program });
};

//Show Copy page
module.exports.editAndCopyPage = async (req, res) => {
    const { id } = req.params
    const program = await Program.findById(id)
    const workout = await Workout.find({ program: { $in: program._id } })
    const exercise = await Workout.find({ program: { $in: program._id } }).populate("exercises");
    res.render("workout/copy", { program, workout, exercise })
};

//Copy program for user
module.exports.saveProgram = async (req, res) => {
    const program = new Program({
        title: req.body.program.title,
        description: req.body.program.description,
        public: false,
        author: req.user
    });
    await program.save();
    const id = program._id;
    for (let w = 0; w < req.body.workouts.session.length; w++) {
        const workoutNum = "workout" + w
        const workout = new Workout({
            session: req.body.workouts.session[w],
            description: req.body.workouts.description[w],
            sequence: w + 1,
            program: id
        });
        await workout.save();
        const workoutId = workout._id;
        await program.updateOne({ $push: { workouts: workout } });
        for (let e = 0; e < req.body[workoutNum].exercise.length; e++) {
            const exercise = new Exercise({
                exercise: req.body[workoutNum].exercise[e],
                sets: req.body[workoutNum].sets[e],
                reps: req.body[workoutNum].reps[e],
                sequence: req.body[workoutNum].sequence[e],
                workout: workoutId
            })
            await exercise.save();
            await workout.updateOne({ $push: { exercises: exercise } });
        };
    };
    res.redirect("/user/programs");
};