const express = require("express");
const router = express.Router();
const program = require("../controllers/programController");
const { isLoggedIn } = require("../middleware")

router.route("/")
    .get(program.programs)
    .post(isLoggedIn, program.newProgram)
    .delete(program.deleteProgram);

router.get("/new", isLoggedIn, program.programForm);

router.get("/:id/edit", program.editForm);

router.patch("/:id", program.edit)

module.exports = router