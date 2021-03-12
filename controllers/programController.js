const Workout = require("../models/workoutSchema");
const Program = require("../models/programSchema");
const Exercise = require("../models/exerciseSchema");

//Show all programs
module.exports.programs = async (req, res) => {
    const programs = await Program.find({});
    res.render("workout/index", { programs });
};

//Create new program
module.exports.newProgram = async (req, res) => {
    const program = await new Program({
        title: req.body.program.title,
        description: req.body.program.description
    });
    await program.save();
    const id = program._id;
    res.redirect(`/programs/${id}/workouts`);
};

//Show edit program form
module.exports.editForm = async (req, res) => {
    const { id } = req.params;
    const program = await Program.findById(id)
    res.render("workout/editProgram", { program })
}

//Update program form
module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const program = await Program.findByIdAndUpdate(id, {
        title: req.body.program.title,
        description: req.body.program.description
    });
    res.redirect(`/programs/${id}/workouts`)
};

//Delete program
module.exports.deleteProgram = async (req, res) => {
    const programId = req.body.program._id;
    const program = await Program.findById(programId);
    const workoutIds = program.workouts;
    const deleteWorkouts = await Workout.deleteMany({ program: { $in: programId } });
    const deleteExercises = await Exercise.deleteMany({ workout: { $in: workoutIds } });
    await Program.findByIdAndDelete(programId);
    res.redirect("/programs");
};

//Shows form to create new programs
module.exports.programForm = (req, res) => {
    res.render("workout/newProgram");
};