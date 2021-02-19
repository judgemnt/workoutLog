const mongoose = require("mongoose");
const Workout = require("../models/workoutSchema");
const Program = require("../models/programSchema");
const { exercises, sets, reps } = require("./exercises.js");

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
    await Program.deleteMany({});
    for (let i = 0; i < 6; i++) {
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
            }],
            description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.Omnis assumenda adipisci animi soluta sunt eum non illum quidem dolores, minus facilis natus dolorem reprehenderit vero neque! Nostrum, rerum! Neque, iste!"
        });
        await workout.save();
        const program = new Program({
            title: `Strong boi ${i}`,
            workouts: [workout],
            description: "this works"
        });
        await program.save();
    };
};


seedDB().then(() => {
    mongoose.connection.close();
})