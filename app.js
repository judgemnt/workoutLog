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
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
    res.render("workout/greet");
});

app.get("/programs", async (req, res) => {
    const programs = await Program.find({}).populate("workouts")
    res.render("workout/index", { programs });
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

app.listen(3000, () => {
    console.log("Localhost 3000");
});