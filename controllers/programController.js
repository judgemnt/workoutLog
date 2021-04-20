const Workout = require("../models/workoutSchema");
const Program = require("../models/programSchema");
const Exercise = require("../models/exerciseSchema");

//Show all programs
module.exports.myPrograms = async (req, res) => {
    //DB Search for programs created by the current user
    const programs = await Program.find({ author: { $in: req.user._id } });
    //render all pages
    res.render("personal/fitness/myPrograms", { programs });
};

//Shows form to create new programs
module.exports.programForm = (req, res) => {
    //render new program form
    res.render("workout/newProgram");
};

//Create new program
module.exports.newProgram = async (req, res) => {
    //creating new Program DB entry
    const program = await new Program({
        title: req.body.program.title,
        description: req.body.program.description,
        author: req.user._id
    });
    await program.save();
    //defining constants
    const id = program._id;
    //rendering program workouts page
    res.redirect(`/user/programs/${id}/workouts`);
};

//Show edit program form
module.exports.editForm = async (req, res) => {
    //defining constants
    const { id } = req.params;
    //searching DB for program
    const program = await Program.findById(id)
    //render edit form with program data
    res.render("personal/fitness/edit/editProgram", { program });
};

//Update program form
module.exports.edit = async (req, res) => {
    //defining constants
    const { id } = req.params;
    //update and save program with new info
    const program = await Program.findByIdAndUpdate(id, {
        title: req.body.program.title,
        description: req.body.program.description
    });
    //render workouts page
    res.redirect(`/user/programs/${id}/workouts`);
};

//Delete program
module.exports.deleteProgram = async (req, res) => {
    //defining constants
    const programId = req.body.program._id;
    const program = await Program.findById(programId);
    const workoutIds = program.workouts;
    //Deleting programs and child schema info
    const deleteWorkouts = await Workout.deleteMany({ program: { $in: programId } });
    const deleteExercises = await Exercise.deleteMany({ workout: { $in: workoutIds } });
    await Program.findByIdAndDelete(programId);
    //render user program list
    res.redirect("/user/programs");
};