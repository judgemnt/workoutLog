const Workout = require("../models/workoutSchema");
const Exercise = require("../models/exerciseSchema");


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
    const { workoutId } = req.params;
    const workout = await Workout.findById(workoutId).populate("exercises");
    const sortedEx = workout.exercises.sort(sorter("sequence"));
    res.render("workout/details", { workout, sortedEx });
};

//create new exercise for a specific workout
module.exports.new = async (req, res) => {
    const { workoutId } = req.params;
    const workout = await Workout.findById(workoutId);
    const id = workout.program;
    console.log(workout.exercises.length)
    const newExercise = new Exercise({
        exercise: req.body.exercises.exercise,
        sets: req.body.exercises.sets,
        reps: req.body.exercises.reps,
        workout: workoutId,
        sequence: `${workout.exercises.length + 1}`
    });
    await newExercise.save();
    await workout.updateOne({ $push: { exercises: newExercise } });
    res.redirect(`/programs/${id}/workouts/${workoutId}`);
};

//Shows form to edit exercises
module.exports.showEdit = async (req, res) => {
    const { workoutId } = req.params;
    const workout = await Workout.findById(workoutId).populate("exercises");
    const sortedEx = workout.exercises.sort(sorter("sequence"));
    res.render("workout/editExercise", { workout, sortedEx });
};

//Updates exercise schema with new info
module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const { workoutId } = req.params;
    const formId = req.body.exercises.id;
    const exerciseLength = req.body.exercises.id.length;
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
    res.redirect(`/programs/${id}/workouts/${workoutId}`);
};

//delete an exercise from a specific workout
module.exports.delete = async (req, res) => {
    const exerciseIds = req.body.exercises.exercise;
    const exercises = await Exercise.find({ _id: { $in: exerciseIds } });
    const workoutId = exercises[0].workout;
    const workout = await Workout.findById(workoutId);
    const id = workout.program;
    await workout.updateOne({ $pull: { exercises: { $in: exerciseIds } } });
    const removeExercise = await Exercise.deleteMany({ _id: { $in: exerciseIds } });
    res.redirect(`/programs/${id}/workouts/${workoutId}`);
};