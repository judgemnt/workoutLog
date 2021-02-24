const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const path = require("path");
const engine = require("ejs-mate");
const Workout = require("./models/workoutSchema");
const Program = require("./models/programSchema");

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

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("workout/greet");
});

app.get("/programs/new", (req, res) => {
    res.render("workout/newProgram");
});

app.post("/programs", async (req, res) => {
    const program = await new Program({
        title: req.body.program.title,
        description: req.body.program.description
    })
    await program.save();
    const id = program._id;
    res.redirect(`/programs/${id}/workouts`);
})

app.get("/programs", async (req, res) => {
    const programs = await Program.find({}).populate("workouts");
    res.render("workout/index", { programs });
});

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

app.get("/programs/:id/workouts", async (req, res) => {
    const { id } = req.params;
    const allWorkouts = await Program.findById(id).populate("workouts");
    res.render("workout/allWorkouts", { allWorkouts });
});

app.get("/programs/:id/workouts/:id", async (req, res) => {
    const { id } = req.params;
    const workout = await Workout.findById(id);
    res.render("workout/details", { workout });
});

app.post("/workouts/:id", async (req, res) => {
    const { id } = req.params;
    const workout = await Workout.findById(id);
    const programId = workout.program;
    await workout.updateOne({
        $push: {
            exercises:
            {
                exercise: req.body.exercises.exercise,
                sets: req.body.exercises.sets,
                reps: req.body.exercises.reps
            }
        }
    });
    res.redirect(`/programs/${programId}/workouts/${id}`)
});

app.listen(3000, () => {
    console.log("Localhost 3000");
});