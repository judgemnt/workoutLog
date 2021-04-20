const express = require("express");
const router = express.Router({ mergeParams: true });
const session = require("../controllers/sessionController");
const { isLoggedIn } = require("../middleware");

router.route("/")
    .get(isLoggedIn, session.newSubmission)
    .post(isLoggedIn, session.new)

router.route("/:sessionId")
    .get(isLoggedIn, session.request)
    .post(isLoggedIn, session.addSessionExercise)
    .patch(isLoggedIn, session.updateSession)
    .delete(isLoggedIn, session.delete)



module.exports = router