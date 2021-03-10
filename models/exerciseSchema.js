const mongoose = require("mongoose");
const Workout = require("./workoutSchema")
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
    workout: {
        type: Schema.Types.ObjectId,
        ref: "Workout"
    },
    sequence: {
        type: Number,
        min: 1,
        required: true
    },
    comments: String
});

module.exports = mongoose.model("Exercise", ExerciseSchema);