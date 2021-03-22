const mongoose = require("mongoose");
const Workout = require("./workoutSchema")
const Personal = require("./personalSchema")
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
    },
    public: Boolean,
    author: {
        type: Schema.Types.ObjectId,
        ref: "Personal"
    }
})

module.exports = mongoose.model("Program", ProgramSchema);