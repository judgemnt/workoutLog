const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
    exercise: {
        type: String,
        required: true
    },
    sets: {
        type: String,
        required: true,
    },
    reps: {
        type: String,
        required: true
    },
    comments: String
})

const WorkoutSchema = new Schema({
    session: {
        type: String,
        required: true
    },
    exercises: [ExerciseSchema],
    comments: String,
    description: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Workout", WorkoutSchema);