const Workout = require("../models/workoutSchema");
const Program = require("../models/programSchema");
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

//Create new workouts for a program
module.exports.new = async (req, res) => {
    //defining constants
    const { id } = req.params;
    //DB look up
    const program = await Program.findById(id);
    //create and save new workout
    const workout = new Workout({
        session: req.body.workouts.session,
        description: req.body.workouts.description,
        program: id,
        sequence: `${program.workouts.length + 1}`
    });
    await workout.save();
    //update program with workout id
    await program.updateOne({ $push: { workouts: workout } });
    //render workouts list
    res.redirect(`/user/programs/${id}/workouts`);
};

//Shows all workouts in a specific program
module.exports.workouts = async (req, res) => {
    //defining constants
    const { id } = req.params;
    //DB look up
    const workouts = await Workout.find({ program: { $in: id } })
    const program = await Program.findById(id)
    //sort workouts by sequence
    const sortedWorkouts = workouts.sort(sorter("sequence"));
    //render workouts based on sequence
    res.render("personal/fitness/myWorkouts", { program, sortedWorkouts });
};

//Show workouts edit form
module.exports.editForm = async (req, res) => {
    //defining constants
    const { id } = req.params;
    //DB look up
    const workouts = await Workout.find({ program: { $in: id } });
    //sort exercises by sequence
    const sortedWorkouts = workouts.sort(sorter("sequence"))
    //render exercises based on sequence
    res.render("personal/fitness/edit/editWorkout", { workouts, sortedWorkouts });
}

//Update workouts
module.exports.editWorkout = async (req, res) => {
    //defining constants
    const { id } = req.params;
    const workoutIds = req.body.workout.id;
    //update workouts if statement to handle single or multiple entry updates
    if (Array.isArray(workoutIds)) {
        for (let w = 0; w < workoutIds.length; w++) {
            const updateWorkout = await Workout.findByIdAndUpdate(workoutIds[w], {
                session: req.body.workout.session[w],
                description: req.body.workout.description[w],
                sequence: req.body.workout.sequence[w]
            });
        };
    } else {
        const updateSingleWorkout = await Workout.findByIdAndUpdate(workoutIds, {
            session: req.body.workout.session,
            description: req.body.workout.description,
            sequence: req.body.workout.sequence
        });
    };
    //render workouts list
    res.redirect(`/user/programs/${id}/workouts`);
};

// Delete workouts from a program
module.exports.delete = async (req, res) => {
    //defining constants and DB look up
    const workoutIds = req.body.workouts.workout;
    const workout = await Workout.find({ _id: { $in: workoutIds } });
    const programId = workout[0].program;
    const program = await Program.findById(programId)
    //delete workout and exercises related to the workout, update program removing workout id
    const deleteExercises = await Exercise.deleteMany({ workout: { $in: workoutIds } });
    const deleteWorkout = await Workout.deleteMany({ _id: { $in: workoutIds } });
    const newProgram = await program.updateOne({ $pull: { workouts: { $in: workoutIds } } });
    //render workouts list
    res.redirect(`/user/programs/${programId}/workouts`);
};