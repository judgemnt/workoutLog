const Workout = require("../models/workoutSchema");
const Exercise = require("../models/exerciseSchema");
const Session = require("../models/sessionSchema");


//function to sort
const sorter = (property, condition) => {

    const key = condition ?
        function (x) {
            return condition(x[property])
        } :
        function (x) {
            return x[property]
        };

    return function (a, b) {
        return a = key(a), b = key(b), ((a > b) - (b > a));
    };
};

//show all exercises for a specific workout
module.exports.show = async (req, res) => {
    //defining constants
    const { workoutId } = req.params;
    //DB search
    const workout = await Workout.findById(workoutId).populate("exercises");
    const sortedEx = workout.exercises.sort(sorter("sequence"));
    const sessions = await Session.find({ workout: { $in: workoutId } });
    //render
    res.render("personal/fitness/myExercises", { workout, sortedEx, sessions });
};

//create new exercise for a specific workout
module.exports.new = async (req, res) => {
    //defining constants
    const { workoutId } = req.params;
    const workout = await Workout.findById(workoutId);
    const id = workout.program;
    //Exercise DB entry
    const newExercise = new Exercise({
        exercise: req.body.exercises.exercise,
        sets: req.body.exercises.sets,
        reps: req.body.exercises.reps,
        workout: workoutId,
        sequence: `${workout.exercises.length + 1}`
    });
    await newExercise.save();
    //Workout DB update with exercise info
    await workout.updateOne({ $push: { exercises: newExercise } });
    //render
    res.redirect(`/user/programs/${id}/workouts/${workoutId}`);
};

//Shows form to edit exercises
module.exports.showEdit = async (req, res) => {
    //defining constants
    const { workoutId } = req.params;
    //DB search
    const workout = await Workout.findById(workoutId).populate("exercises");
    //Sorting entry data
    const sortedEx = workout.exercises.sort(sorter("sequence"));
    //render
    res.render("personal/fitness/edit/editExercise", { workout, sortedEx });
};

//Updates exercise schema with new info
module.exports.edit = async (req, res) => {
    //defining constants
    const { id } = req.params;
    const { workoutId } = req.params;
    const deleteId = req.body.deleteId
    const formId = req.body.exercises.id;
    const exerciseLength = req.body.exercises.id.length;
    //DB search
    const workout = await Workout.findById(workoutId);
    //Updating exercises - if statement to handle multiple vs single entry updates
    if (Array.isArray(formId)) {
        for (let e = 0; e < exerciseLength; e++) {
            const updateExercises = await Exercise.findByIdAndUpdate(formId[e], {
                exercise: req.body.exercises.exercise[e],
                sets: req.body.exercises.sets[e],
                reps: req.body.exercises.reps[e],
                sequence: req.body.exercises.sequence[e]
            });
        };
    } else {
        const updateSingleExercise = await Exercise.findByIdAndUpdate(formId, {
            exercise: req.body.exercises.exercise,
            sets: req.body.exercises.sets,
            reps: req.body.exercises.reps,
            sequence: req.body.exercises.sequence
        });
    };
    //Deleting selected from DB
    if (req.body.deleteId) {
        await workout.updateOne({ $pull: { exercises: { $in: deleteId } } });
        const pullSession = await Session.updateMany({ workout: { $in: workoutId } }, { $pull: { exercises: { exerciseId: { $in: deleteId } } } });
        const removeExercise = await Exercise.deleteMany({ _id: { $in: deleteId } })
    };
    //render
    res.redirect(`/user/programs/${id}/workouts/${workoutId}`);
};