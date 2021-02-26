const mongoose = require("mongoose");
const Program = require("./programSchema");
const Exercise = require("./exerciseSchema")
const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
    session: {
        type: String,
        required: true
    },
    exercises: [{
        type: Schema.Types.ObjectId,
        ref: "Exercise"
    }],
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