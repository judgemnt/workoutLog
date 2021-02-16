const mongoose = require("mongoose");
const Workout = require("../models/workoutSchema")
const { exercises, sets, reps } = require("./exercises.js")

mongoose.connect('mongodb://localhost:27017/workoutLog', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Workout.deleteMany({});
    for (let i = 0; i < 7; i++) {
        const workout = new Workout({
            session: `Day ${i}`,
            exercises: [{
                exercise: `${sample(exercises)}`,
                sets: `${sample(sets)}`,
                reps: `${sample(reps)}`
            }, {
                exercise: `${sample(exercises)}`,
                sets: `${sample(sets)}`,
                reps: `${sample(reps)}`
            }, {
                exercise: `${sample(exercises)}`,
                sets: `${sample(sets)}`,
                reps: `${sample(reps)}`
            }, {
                exercise: `${sample(exercises)}`,
                sets: `${sample(sets)}`,
                reps: `${sample(reps)}`
            }, {
                exercise: `${sample(exercises)}`,
                sets: `${sample(sets)}`,
                reps: `${sample(reps)}`
            }, {
                exercise: `${sample(exercises)}`,
                sets: `${sample(sets)}`,
                reps: `${sample(reps)}`
            }, {
                exercise: `${sample(exercises)}`,
                sets: `${sample(sets)}`,
                reps: `${sample(reps)}`
            }, {
                exercise: `${sample(exercises)}`,
                sets: `${sample(sets)}`,
                reps: `${sample(reps)}`
            }, {
                exercise: `${sample(exercises)}`,
                sets: `${sample(sets)}`,
                reps: `${sample(reps)}`
            }, {
                exercise: `${sample(exercises)}`,
                sets: `${sample(sets)}`,
                reps: `${sample(reps)}`
            }]
        })
        await workout.save();
    }
}


seedDB().then(() => {
    mongoose.connection.close();
})