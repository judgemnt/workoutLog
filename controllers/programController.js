const Workout = require("../models/workoutSchema");
const Program = require("../models/programSchema");
const Exercise = require("../models/exerciseSchema");

//Show all programs
module.exports.myPrograms = async (req, res) => {
    const programs = await Program.find({ author: { $in: req.user._id } });
    res.render("personal/fitness/myPrograms", { programs });
};
//Shows form to create new programs
module.exports.programForm = (req, res) => {
    res.render("workout/newProgram");
};

//Create new program
module.exports.newProgram = async (req, res) => {
    const program = await new Program({
        title: req.body.program.title,
        description: req.body.program.description,
        public: req.body.program.public,
        author: req.user._id
    });
    await program.save();
    const id = program._id;
    res.redirect(`/user/programs/${id}/workouts`);
};

//Show edit program form
module.exports.editForm = async (req, res) => {
    const { id } = req.params;
    const program = await Program.findById(id)
    res.render("personal/fitness/edit/editProgram", { program });
};

//Update program form
module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const program = await Program.findByIdAndUpdate(id, {
        title: req.body.program.title,
        description: req.body.program.description,
        public: req.body.program.public
    });
    res.redirect(`/user/programs/${id}/workouts`);
};

//Delete program
module.exports.deleteProgram = async (req, res) => {
    const programId = req.body.program._id;
    const program = await Program.findById(programId);
    const workoutIds = program.workouts;
    const deleteWorkouts = await Workout.deleteMany({ program: { $in: programId } });
    const deleteExercises = await Exercise.deleteMany({ workout: { $in: workoutIds } });
    await Program.findByIdAndDelete(programId);
    res.redirect("/user/programs");
};