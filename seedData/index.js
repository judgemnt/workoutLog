const mongoose = require("mongoose");
const Workout = require("../models/workoutSchema");
const Program = require("../models/programSchema");
const Exercise = require("../models/exerciseSchema")
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
    await Program.deleteMany({});
    await Workout.deleteMany({});
    await Exercise.deleteMany({});
    for (let i = 0; i < 5; i++) {
        const program = new Program({
            title: `program${[i]}`,
            description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
        });
        await program.save();
        const workout = new Workout({
            session: `Session${i}`,
            comments: "none",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            program: program._id,
            sequence: 1
        });
        await workout.save();
        await program.updateOne({ $push: { workouts: workout._id } });
        const exercise = new Exercise({
            exercise: `${sample(exercises)}`,
            sets: `${sample(sets)}`,
            reps: `${sample(reps)}`,
            workout: workout._id,
            sequence: 1
        });
        await exercise.save();
        await workout.updateOne({ $push: { exercises: exercise._id } });
    };
};

seedDB().then(() => {
    mongoose.connection.close();
})