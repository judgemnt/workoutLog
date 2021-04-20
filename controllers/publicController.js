const Program = require("../models/programSchema");
const Workout = require("../models/workoutSchema");
const Exercise = require("../models/exerciseSchema");

//Show all Public Programs
module.exports.publicPrograms = async (req, res) => {
    //search program db for public programs
    const programs = await Program.find({ public: true });
    //render programs from search result
    res.render("workout/index", { programs });
};

//Show all workouts for a public Program
module.exports.publicWorkouts = async (req, res) => {
    //define constants
    const { id } = req.params;
    const workouts = await Workout.find({ program: { $in: id } });
    const program = await Program.findById(id);
    //render workouts for a program
    res.render("workout/allWorkouts", { program, workouts });
};

//Show all exercises for a public workout
module.exports.publicWorkout = async (req, res) => {
    //defining consatnts
    const { workoutId } = req.params;
    //DB look up
    const program = await Program.findOne({ workouts: workoutId });
    const workout = await Exercise.find({ workout: { $in: workoutId } });
    //render exercises for a workout
    res.render("workout/details", { workout, program });
};

//Show Copy page
module.exports.editAndCopyPage = async (req, res) => {
    //defining constants
    const { id } = req.params
    //DB lookup
    const program = await Program.findById(id)
    const workout = await Workout.find({ program: { $in: program._id } })
    const exercise = await Workout.find({ program: { $in: program._id } }).populate("exercises");
    //render pre-populated workout copy page
    res.render("workout/copy", { program, workout, exercise })
};

//Copy program for user
module.exports.saveProgram = async (req, res) => {
    //create and save new program
    const program = new Program({
        title: req.body.program.title,
        description: req.body.program.description,
        public: false,
        author: req.user
    });
    await program.save();
    //assign program id
    const id = program._id;
    //create and save workouts
    for (let w = 0; w < req.body.workouts.session.length; w++) {
        const workoutNum = "workout" + w
        const workout = new Workout({
            session: req.body.workouts.session[w],
            description: req.body.workouts.description[w],
            sequence: w + 1,
            program: id
        });
        await workout.save();
        //assign workout id
        const workoutId = workout._id;
        //update program with workout id
        await program.updateOne({ $push: { workouts: workout } });
        //create and save exercises
        for (let e = 0; e < req.body[workoutNum].exercise.length; e++) {
            const exercise = new Exercise({
                exercise: req.body[workoutNum].exercise[e],
                sets: req.body[workoutNum].sets[e],
                reps: req.body[workoutNum].reps[e],
                sequence: req.body[workoutNum].sequence[e],
                workout: workoutId
            })
            await exercise.save();
            //update workout with exercise id
            await workout.updateOne({ $push: { exercises: exercise } });
        };
    };
    //render user programs
    res.redirect("/user/programs");
};