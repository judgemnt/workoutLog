const express = require("express");
const router = express.Router();
const program = require("../controllers/programController");

router.route("/")
    .get(program.programs)
    .post(program.newProgram)
    .delete(program.deleteProgram);

router.get("/new", program.programForm);

router.get("/:id/edit", program.editForm);

router.patch("/:id", program.edit)

module.exports = router