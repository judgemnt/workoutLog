const mongoose = require("mongoose");
const Program = require("./programSchema")
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
        type: String
    },
    program: {
        type: Schema.Types.ObjectId,
        ref: "Program"
    }
})

module.exports = mongoose.model("Workout", WorkoutSchema);