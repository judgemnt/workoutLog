const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const path = require("path");
const engine = require("ejs-mate");
const Workout = require("./models/workoutSchema");
const Program = require("./models/programSchema");
const Exercise = require("./models/exerciseSchema");
const methodOverride = require("method-override");

mongoose.connect('mongodb://localhost:27017/workoutLog', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected");
    })
    .catch((e) => {
        console.log("Connection error");
        console.log(e);
    });

app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

//Shows landing page
app.get("/", (req, res) => {
    res.render("workout/greet");
});

//Shows all programs
app.get("/programs", async (req, res) => {
    const programs = await Program.find({}).populate("workouts");
    res.render("workout/index", { programs });
});

//Shows form to create new programs
app.get("/programs/new", (req, res) => {
    res.render("workout/newProgram");
});

//Create new programs
app.post("/programs", async (req, res) => {
    const program = await new Program({
        title: req.body.program.title,
        description: req.body.program.description
    });
    await program.save();
    const id = program._id;
    res.redirect(`/programs/${id}/workouts`);
});

//Shows all workouts in a specific program
app.get("/programs/:id/workouts", async (req, res) => {
    const { id } = req.params;
    const allWorkouts = await Program.findById(id).populate("workouts");
    res.render("workout/allWorkouts", { allWorkouts });
});

//Create new workouts for a program
app.post("/programs/:id", async (req, res) => {
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
});

//Shows all exercises in a specific program
app.get("/programs/:id/workouts/:id", async (req, res) => {
    const { id } = req.params;
    const workout = await Workout.findById(id).populate("exercises");
    res.render("workout/details", { workout });
});

//Create new exercises for a specific workout
app.post("/workouts/:id", async (req, res) => {
    const { id } = req.params;
    const workout = await Workout.findById(id);
    const programId = workout.program;
    const newExercise = new Exercise({
        exercise: req.body.exercises.exercise,
        sets: req.body.exercises.sets,
        reps: req.body.exercises.reps,
        workout: id
    });
    await newExercise.save();
    await workout.updateOne({ $push: { exercises: newExercise } });
    res.redirect(`/programs/${programId}/workouts/${id}`)
});

//Delete a specific exercise in a workout
app.delete("/workouts/:id", async (req, res) => {
    const exerciseIds = req.body.exercises.exercise;
    const exercises = await Exercise.find({ _id: { $in: exerciseIds } });
    const workoutId = exercises[0].workout;
    const workout = await Workout.findById(workoutId);
    const programId = workout.program;
    await workout.updateOne({ $pull: { exercises: { $in: exerciseIds } } });
    const removeExercise = await Exercise.deleteMany({ _id: { $in: exerciseIds } });
    res.redirect(`/programs/${programId}/workouts/${workoutId}`)
})

app.listen(3000, () => {
    console.log("Localhost 3000");
});