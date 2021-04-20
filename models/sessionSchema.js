const mongoose = require("mongoose");
const Exercise = require("./exerciseSchema");
const Workout = require("./workoutSchema");
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
    sessionName: {
        type: String,
        required: true
    },
    workout: {
        type: Schema.Types.ObjectId,
        ref: "Workout",
        required: true
    },
    exercises: [{
        _id: false,
        exerciseId: {
            type: Schema.Types.ObjectId,
            ref: "Exercise",
        },
        weight: Number,
        setCount: Number,
    }]
});

module.exports = mongoose.model("Session", SessionSchema);