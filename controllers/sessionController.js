const Program = require("../models/programSchema");
const Workout = require("../models/workoutSchema");
const Exercise = require("../models/exerciseSchema");
const Session = require("../models/sessionSchema");
const { session } = require("passport");

//Function to sort based on squence
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
//Get new session form
module.exports.newSubmission = async (req, res) => {
    //defining constants
    const { workoutId } = req.params;
    //searching DB for workout and session
    const workout = await Workout.findById(workoutId).populate("exercises")
    const sessionList = await Session.find({ workout: { $in: workoutId } });
    //sorting exercises based on sequence
    const sortedEx = workout.exercises.sort(sorter("sequence"));
    //render new session page
    res.render("personal/fitness/newSession", { workout, workoutId, sessionList, sortedEx })
}

//Create new Session
module.exports.new = async (req, res) => {
    //defining constants
    const { workoutId } = req.params;
    const sessInfo = req.body.session;
    // saving session info, handled differently for arrays vs single entries
    if (Array.isArray(sessInfo.exercise)) {
        const session = new Session({
            sessionName: sessInfo.sessionName,
            workout: workoutId
        });
        await session.save();
        for (let e = 0; e < sessInfo.exercise.length; e++) {
            await session.updateOne({ $push: { exercises: [{ exerciseId: sessInfo.exercise[e], weight: sessInfo.weight[e] }] } })
        };
        res.redirect(`/user/workout/${workoutId}/session/${session._id}`);
    } else {
        const session = new Session({
            sessionName: sessInfo.sessionName,
            workout: workoutId,
            exercises: [{
                exerciseId: sessInfo.exercise,
                weight: sessInfo.weight
            }]
        });
        await session.save();
        res.redirect(`/user/workout/${workoutId}/session/${session._id}`);
    };
};


//Load existing session
module.exports.request = async (req, res) => {
    //defining constants
    const { workoutId, sessionId } = req.params;
    //searching DB for a list of all sessions, the specific workout, and session
    const sessionList = await Session.find({ workout: { $in: workoutId } });
    const workout = await Workout.findById(workoutId).populate("exercises");
    const session = await Session.findById(sessionId).populate("exercises.exerciseId");
    res.render("personal/fitness/mySession", { sessionList, workout, workoutId, session });;
};

//update existing session
module.exports.updateSession = async (req, res) => {
    //defining constants
    const { sessionId, workoutId } = req.params;
    const { sessionName, exercise, weight, count } = req.body.session;
    //removing old session info
    const removeOld = await Session.findByIdAndUpdate(sessionId, { $set: { exercises: [] } });
    //adding new session info
    for (let e = 0; e < weight.length; e++) {
        console.log(count[e])
        const newSession = await Session.findByIdAndUpdate(sessionId, {
            sessionName: sessionName,
            $push: {
                exercises: [{
                    exerciseId: exercise[e],
                    weight: weight[e],
                    setCount: count[e]
                }]
            }
        });
    };
    //redirect to session
    res.redirect(`/user/workout/${workoutId}/session/${sessionId}`);
};

//Delete session
module.exports.delete = async (req, res) => {
    //defining constants
    const { sessionId, workoutId } = req.params;
    //searching db for program Id
    const workout = await Workout.findById(workoutId);
    const programId = workout.program;
    //deleting session
    const deleteSession = await Session.findByIdAndDelete(sessionId);
    //redirect to exercise list for this workout
    res.redirect(`/user/programs/${programId}/workouts/${workoutId}`)
}

//Add exercise to session only
module.exports.addSessionExercise = async (req, res) => {
    //defining constants
    const { workoutId, sessionId } = req.params;
    const { exercise, sets, reps } = req.body.exercises
    const session = await Session.findById(sessionId)
    const sessionLength = session.exercises.length
    //create new exercise
    const newExercise = new Exercise({
        exercise: exercise,
        sets: sets,
        reps: reps,
        sequence: `${sessionLength + 1}`
    })
    await newExercise.save()
    //save exercise to session
    const updateSession = await Session.findByIdAndUpdate(sessionId, { $push: { exercises: { exerciseId: newExercise._id } } })
    //redirect to session
    res.redirect(`/user/workout/${workoutId}/session/${sessionId}`);
}