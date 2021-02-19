const mongoose = require("mongoose");
const Workout = require("./workoutSchema")
const Schema = mongoose.Schema;

const ProgramSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    workouts: [{
        type: Schema.Types.ObjectId,
        ref: "Workout"
    }],
    description: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Program", ProgramSchema);