const express = require("express");
const router = express.Router();
const program = require("../controllers/programController");
const { isLoggedIn } = require("../middleware");

router.route("/")
    .get(isLoggedIn, program.myPrograms)
    .post(isLoggedIn, program.newProgram)
    .delete(isLoggedIn, program.deleteProgram);

router.get("/new", isLoggedIn, program.programForm);

router.get("/:id/edit", isLoggedIn, program.editForm);

router.patch("/:id", isLoggedIn, program.edit);

module.exports = router